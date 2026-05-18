import pytest
from api.validator import validate


def base_character(**overrides):
    """Minimal valid character data."""
    char = {
        "name": "Dracula",
        "player": "Test",
        "concept": "Ancient predator",
        "ambition": "Dominate the city",
        "desire": "Feed freely",
        "clan": "Ventrue",
        "generation": 13,
        "bloodPotency": 1,
        "hunger": 1,
        "humanity": 7,
        "attributes": {
            "strength": 1, "dexterity": 1, "stamina": 1,
            "charisma": 1, "manipulation": 1, "composure": 1,
            "intelligence": 1, "wits": 1, "resolve": 1,
        },
        "physicalSkills": [],
        "socialSkills": [],
        "mentalSkills": [],
        "disciplines": [],
        "health": ["empty"] * 4,    # stamina 1 + 3
        "willpower": ["empty"] * 2,  # composure 1 + resolve 1
    }
    char.update(overrides)
    return char


class TestValidBase:
    def test_valid_character_has_no_errors(self):
        result = validate(base_character())
        assert result.valid is True
        assert result.errors == []

    def test_valid_character_warns_about_missing_disciplines(self):
        # Ventrue should have Dominate/Fortitude/Presence; base has none
        result = validate(base_character())
        fields = [w.field for w in result.warnings]
        assert "disciplines" in fields


class TestAttributes:
    def test_attribute_zero_is_an_error(self):
        char = base_character()
        char["attributes"]["strength"] = 0
        result = validate(char)
        assert result.valid is False
        assert any("Strength" in e.message for e in result.errors)

    def test_attribute_above_five_is_an_error(self):
        char = base_character()
        char["attributes"]["dexterity"] = 6
        result = validate(char)
        assert result.valid is False
        assert any("Dexterity" in e.message for e in result.errors)

    def test_attribute_at_five_is_valid(self):
        char = base_character()
        char["attributes"]["stamina"] = 5
        char["health"] = ["empty"] * 8  # stamina 5 + 3
        result = validate(char)
        assert not any("Stamina" in e.message for e in result.errors)


class TestSkills:
    def test_skill_above_five_is_an_error(self):
        char = base_character()
        char["physicalSkills"] = [{"id": "brawl", "name": "Brawl", "rating": 6, "specialty": ""}]
        result = validate(char)
        assert result.valid is False
        assert any("Brawl" in e.message for e in result.errors)

    def test_skill_at_five_is_valid(self):
        char = base_character()
        char["physicalSkills"] = [{"id": "brawl", "name": "Brawl", "rating": 5, "specialty": ""}]
        result = validate(char)
        assert not any("Brawl" in e.message for e in result.errors)


class TestHealthWillpower:
    def test_wrong_health_count_is_an_error(self):
        char = base_character(health=["empty"] * 3)  # should be 4
        result = validate(char)
        assert result.valid is False
        assert any(e.field == "health" for e in result.errors)

    def test_correct_health_count_for_stamina_3(self):
        char = base_character()
        char["attributes"]["stamina"] = 3
        char["health"] = ["empty"] * 6  # 3+3
        result = validate(char)
        assert not any(e.field == "health" for e in result.errors)

    def test_wrong_willpower_count_is_an_error(self):
        char = base_character(willpower=["empty"])  # should be 2
        result = validate(char)
        assert result.valid is False
        assert any(e.field == "willpower" for e in result.errors)

    def test_correct_willpower_for_composure_2_resolve_3(self):
        char = base_character()
        char["attributes"]["composure"] = 2
        char["attributes"]["resolve"] = 3
        char["willpower"] = ["empty"] * 5  # 2+3
        result = validate(char)
        assert not any(e.field == "willpower" for e in result.errors)


class TestBloodPotency:
    def test_bp_exceeds_gen_max_is_an_error(self):
        # Gen 13 max BP = 1; setting BP to 2 should fail
        char = base_character(bloodPotency=2)
        result = validate(char)
        assert result.valid is False
        assert any(e.field == "bloodPotency" for e in result.errors)

    def test_bp_within_gen_max_is_valid(self):
        # Gen 9 max BP = 4
        char = base_character(generation=9, bloodPotency=4)
        result = validate(char)
        assert not any(e.field == "bloodPotency" for e in result.errors)

    def test_thin_blood_can_have_bp_zero(self):
        char = base_character(clan="Thin-Blood", bloodPotency=0)
        result = validate(char)
        assert not any(e.field == "bloodPotency" for e in result.errors)


class TestHunger:
    def test_hunger_above_five_is_an_error(self):
        result = validate(base_character(hunger=6))
        assert result.valid is False
        assert any(e.field == "hunger" for e in result.errors)

    def test_hunger_below_zero_is_an_error(self):
        result = validate(base_character(hunger=-1))
        assert result.valid is False

    def test_hunger_zero_is_valid(self):
        result = validate(base_character(hunger=0))
        assert not any(e.field == "hunger" for e in result.errors)

    def test_hunger_five_is_valid(self):
        result = validate(base_character(hunger=5))
        assert not any(e.field == "hunger" for e in result.errors)


class TestHumanity:
    def test_humanity_above_ten_is_an_error(self):
        result = validate(base_character(humanity=11))
        assert result.valid is False

    def test_humanity_below_zero_is_an_error(self):
        result = validate(base_character(humanity=-1))
        assert result.valid is False

    def test_humanity_zero_is_valid(self):
        result = validate(base_character(humanity=0))
        assert not any(e.field == "humanity" for e in result.errors)


class TestClan:
    def test_invalid_clan_is_an_error(self):
        result = validate(base_character(clan="NotAClan"))
        assert result.valid is False
        assert any(e.field == "clan" for e in result.errors)

    def test_no_clan_produces_warning(self):
        result = validate(base_character(clan=""))
        assert any(w.field == "clan" for w in result.warnings)

    def test_caitiff_is_valid(self):
        result = validate(base_character(clan="Caitiff"))
        assert not any(e.field == "clan" for e in result.errors)

    def test_all_v5_clans_are_valid(self):
        clans = [
            "Banu Haqim", "Brujah", "Gangrel", "Hecata", "Lasombra",
            "Malkavian", "Ministry", "Nosferatu", "Ravnos", "Salubri",
            "Toreador", "Tremere", "Tzimisce", "Ventrue", "Caitiff", "Thin-Blood",
        ]
        for clan in clans:
            result = validate(base_character(clan=clan))
            assert not any(e.field == "clan" for e in result.errors), f"Clan {clan} unexpectedly failed"


class TestClanDisciplineWarnings:
    def test_gangrel_missing_disciplines_warns(self):
        result = validate(base_character(clan="Gangrel", disciplines=[]))
        missing_warn = [w for w in result.warnings if w.field == "disciplines"]
        assert len(missing_warn) == 1
        assert "Animalism" in missing_warn[0].message or "Fortitude" in missing_warn[0].message

    def test_no_discipline_warning_when_all_clan_discs_present(self):
        char = base_character(clan="Brujah")
        char["disciplines"] = [
            {"id": "1", "name": "Celerity", "rating": 1, "powers": []},
            {"id": "2", "name": "Potence", "rating": 1, "powers": []},
            {"id": "3", "name": "Presence", "rating": 1, "powers": []},
        ]
        result = validate(char)
        assert not any(w.field == "disciplines" for w in result.warnings)

    def test_caitiff_gets_no_discipline_warning(self):
        result = validate(base_character(clan="Caitiff", disciplines=[]))
        assert not any(w.field == "disciplines" for w in result.warnings)


class TestRequiredFieldWarnings:
    def test_missing_name_warns(self):
        result = validate(base_character(name=""))
        assert any(w.field == "name" for w in result.warnings)

    def test_missing_concept_warns(self):
        result = validate(base_character(concept=""))
        assert any(w.field == "concept" for w in result.warnings)

    def test_missing_ambition_warns(self):
        result = validate(base_character(ambition=""))
        assert any(w.field == "ambition" for w in result.warnings)

    def test_missing_desire_warns(self):
        result = validate(base_character(desire=""))
        assert any(w.field == "desire" for w in result.warnings)

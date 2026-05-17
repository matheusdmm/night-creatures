from .models import ValidationIssue, ValidateResponse

# V5 rulebook: Generation → maximum Blood Potency
_GEN_MAX_BP: dict[int, int] = {
    16: 0, 15: 0, 14: 0,
    13: 1, 12: 1,
    11: 2, 10: 3, 9: 4, 8: 5,
    7: 6, 6: 7, 5: 8, 4: 10,
}

_CLAN_DISCIPLINES: dict[str, list[str]] = {
    "Banu Haqim": ["Blood Sorcery", "Celerity", "Obfuscate"],
    "Brujah": ["Celerity", "Potence", "Presence"],
    "Gangrel": ["Animalism", "Fortitude", "Protean"],
    "Hecata": ["Auspex", "Fortitude", "Oblivion"],
    "Lasombra": ["Dominate", "Oblivion", "Potence"],
    "Malkavian": ["Auspex", "Dominate", "Obfuscate"],
    "Ministry": ["Obfuscate", "Presence", "Protean"],
    "Nosferatu": ["Animalism", "Obfuscate", "Potence"],
    "Ravnos": ["Animalism", "Obfuscate", "Presence"],
    "Salubri": ["Auspex", "Dominate", "Fortitude"],
    "Toreador": ["Auspex", "Celerity", "Presence"],
    "Tremere": ["Auspex", "Blood Sorcery", "Dominate"],
    "Tzimisce": ["Animalism", "Dominate", "Protean"],
    "Ventrue": ["Dominate", "Fortitude", "Presence"],
}

_VALID_CLANS = set(_CLAN_DISCIPLINES.keys()) | {"Caitiff", "Thin-Blood"}


def validate(data: dict) -> ValidateResponse:
    errors: list[ValidationIssue] = []
    warnings: list[ValidationIssue] = []

    def err(field: str, msg: str) -> None:
        errors.append(ValidationIssue(field=field, message=msg))

    def warn(field: str, msg: str) -> None:
        warnings.append(ValidationIssue(field=field, message=msg))

    attrs: dict[str, int] = data.get("attributes", {})
    attr_names = [
        "strength", "dexterity", "stamina",
        "charisma", "manipulation", "composure",
        "intelligence", "wits", "resolve",
    ]

    # --- Attributes ---
    for name in attr_names:
        val = attrs.get(name, 1)
        if val < 1:
            err("attributes", f"{name.title()} cannot be 0 — vampires always have at least 1.")
        if val > 5:
            err("attributes", f"{name.title()} cannot exceed 5.")

    # --- Skills ---
    for category in ("physicalSkills", "socialSkills", "mentalSkills"):
        for skill in data.get(category, []):
            if skill.get("rating", 0) > 5:
                err(category, f'{skill["name"]} rating cannot exceed 5.')

    # --- Health = Stamina + 3 ---
    stamina = attrs.get("stamina", 1)
    expected_health = stamina + 3
    actual_health = len(data.get("health", []))
    if actual_health != expected_health:
        err(
            "health",
            f"Health should have {expected_health} boxes (Stamina {stamina} + 3), "
            f"but has {actual_health}.",
        )

    # --- Willpower = Composure + Resolve ---
    composure = attrs.get("composure", 1)
    resolve = attrs.get("resolve", 1)
    expected_wp = composure + resolve
    actual_wp = len(data.get("willpower", []))
    if actual_wp != expected_wp:
        err(
            "willpower",
            f"Willpower should have {expected_wp} boxes (Composure {composure} + Resolve {resolve}), "
            f"but has {actual_wp}.",
        )

    # --- Blood Potency vs Generation ---
    generation = data.get("generation", 13)
    bp = data.get("bloodPotency", 1)
    max_bp = _GEN_MAX_BP.get(generation, 1)
    if bp > max_bp:
        err(
            "bloodPotency",
            f"Blood Potency {bp} exceeds the maximum of {max_bp} for a {generation}th-generation vampire.",
        )
    if bp < 1 and data.get("clan") not in ("Thin-Blood", "Caitiff", ""):
        err("bloodPotency", "Blood Potency must be at least 1.")

    # --- Hunger ---
    hunger = data.get("hunger", 1)
    if hunger < 0 or hunger > 5:
        err("hunger", "Hunger must be between 0 and 5.")

    # --- Humanity ---
    humanity = data.get("humanity", 7)
    if humanity < 0 or humanity > 10:
        err("humanity", "Humanity must be between 0 and 10.")

    # --- Discipline ratings ---
    for disc in data.get("disciplines", []):
        if disc.get("rating", 0) > 5:
            err("disciplines", f'{disc.get("name", "Discipline")} rating cannot exceed 5.')

    # --- Clan discipline check (warnings) ---
    clan = data.get("clan", "")
    if clan and clan in _CLAN_DISCIPLINES:
        chosen_names = {d.get("name") for d in data.get("disciplines", [])}
        missing = [d for d in _CLAN_DISCIPLINES[clan] if d not in chosen_names]
        if missing:
            warn(
                "disciplines",
                f"Missing in-clan disciplines for {clan}: {', '.join(missing)}.",
            )

    # --- Required field warnings ---
    if not data.get("name", "").strip():
        warn("name", "Character has no name.")
    if not clan:
        warn("clan", "No clan selected.")
    if clan and clan not in _VALID_CLANS:
        err("clan", f'"{clan}" is not a valid V5 clan.')
    if not data.get("concept", "").strip():
        warn("concept", "Concept is empty.")
    if not data.get("ambition", "").strip():
        warn("ambition", "Ambition is empty.")
    if not data.get("desire", "").strip():
        warn("desire", "Desire is empty.")

    return ValidateResponse(valid=len(errors) == 0, errors=errors, warnings=warnings)

import random
from unittest.mock import patch

import pytest
from api.dice import roll


def fixed_roll(values):
    """Helper: patch random.randint to return values in sequence."""
    it = iter(values)
    return patch("api.dice.random.randint", side_effect=lambda a, b: next(it))


class TestDicePool:
    def test_all_hunger_when_hunger_equals_pool(self):
        with fixed_roll([7, 8]):
            result = roll(pool=2, hunger=2, difficulty=1)
        assert len(result.regular_dice) == 0
        assert len(result.hunger_dice) == 2

    def test_hunger_capped_to_pool(self):
        # hunger=5 but pool=2 → only 2 hunger dice
        with fixed_roll([6, 7]):
            result = roll(pool=2, hunger=5, difficulty=1)
        assert len(result.hunger_dice) == 2
        assert len(result.regular_dice) == 0

    def test_no_hunger_dice_when_hunger_zero(self):
        with fixed_roll([6, 8, 3]):
            result = roll(pool=3, hunger=0, difficulty=1)
        assert len(result.hunger_dice) == 0
        assert len(result.regular_dice) == 3

    def test_total_dice_equals_pool(self):
        with fixed_roll([1, 2, 3, 4, 5]):
            result = roll(pool=5, hunger=2, difficulty=1)
        assert len(result.regular_dice) + len(result.hunger_dice) == 5


class TestSuccessCount:
    def test_six_through_nine_count_as_one_success_each(self):
        with fixed_roll([6, 7, 8, 9, 1, 2, 3, 4]):
            result = roll(pool=8, hunger=0, difficulty=1)
        assert result.successes == 4

    def test_five_and_below_are_not_successes(self):
        with fixed_roll([1, 2, 3, 4, 5]):
            result = roll(pool=5, hunger=0, difficulty=6)
        assert result.successes == 0
        assert result.difficulty_met is False

    def test_pair_of_tens_adds_two_extra_successes(self):
        # 2 tens → 2 base successes + 2 extra = 4
        with fixed_roll([10, 10]):
            result = roll(pool=2, hunger=0, difficulty=1)
        assert result.successes == 4

    def test_three_tens_adds_two_extra_successes(self):
        # 3 tens → 3 base + 2 (one pair) = 5
        with fixed_roll([10, 10, 10]):
            result = roll(pool=3, hunger=0, difficulty=1)
        assert result.successes == 5

    def test_four_tens_adds_four_extra_successes(self):
        # 4 tens → 4 base + 4 (two pairs) = 8
        with fixed_roll([10, 10, 10, 10]):
            result = roll(pool=4, hunger=0, difficulty=1)
        assert result.successes == 8


class TestResultTypes:
    def test_basic_success(self):
        with fixed_roll([6, 3]):
            result = roll(pool=2, hunger=0, difficulty=1)
        assert result.result_type == "success"
        assert result.difficulty_met is True

    def test_failure(self):
        with fixed_roll([1, 2]):
            result = roll(pool=2, hunger=0, difficulty=5)
        assert result.result_type == "failure"
        assert result.difficulty_met is False

    def test_bestial_failure_requires_hunger_one(self):
        # hunger die shows 1, no successes
        with fixed_roll([2, 1]):  # regular=2, hunger=1
            result = roll(pool=2, hunger=1, difficulty=3)
        assert result.result_type == "bestial_failure"

    def test_no_bestial_failure_when_one_is_on_regular_die(self):
        with fixed_roll([1, 2]):  # both regular, hunger=0
            result = roll(pool=2, hunger=0, difficulty=3)
        assert result.result_type == "failure"

    def test_critical_win(self):
        # two 10s, no hunger dice
        with fixed_roll([10, 10]):
            result = roll(pool=2, hunger=0, difficulty=1)
        assert result.result_type == "critical_win"

    def test_messy_critical_requires_hunger_ten(self):
        # one regular 10, one hunger 10 → messy critical
        with fixed_roll([10, 10]):
            result = roll(pool=2, hunger=1, difficulty=1)
        assert result.result_type == "messy_critical"

    def test_critical_win_with_no_hunger(self):
        with fixed_roll([10, 10, 1]):
            result = roll(pool=3, hunger=0, difficulty=1)
        assert result.result_type == "critical_win"


class TestMargin:
    def test_margin_is_successes_minus_difficulty(self):
        with fixed_roll([6, 7, 8]):
            result = roll(pool=3, hunger=0, difficulty=2)
        assert result.margin == result.successes - 2

    def test_margin_is_negative_on_failure(self):
        with fixed_roll([1, 2]):
            result = roll(pool=2, hunger=0, difficulty=5)
        assert result.margin < 0

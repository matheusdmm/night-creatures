import random
from .models import RollResponse


def roll(pool: int, hunger: int, difficulty: int) -> RollResponse:
    hunger = min(hunger, pool)
    regular_count = pool - hunger

    regular_dice = [random.randint(1, 10) for _ in range(regular_count)]
    hunger_dice = [random.randint(1, 10) for _ in range(hunger)]

    all_dice = regular_dice + hunger_dice
    regular_tens = sum(1 for d in regular_dice if d == 10)
    hunger_tens = sum(1 for d in hunger_dice if d == 10)
    total_tens = regular_tens + hunger_tens

    # Base successes: 6+ counts as 1
    successes = sum(1 for d in all_dice if d >= 6)

    # Critical: every pair of 10s grants 2 extra successes
    critical_pairs = total_tens // 2
    successes += critical_pairs * 2

    difficulty_met = successes >= difficulty
    has_critical = total_tens >= 2
    has_hunger_one = any(d == 1 for d in hunger_dice)
    has_hunger_ten = hunger_tens > 0

    if difficulty_met:
        if has_critical and has_hunger_ten:
            result_type = "messy_critical"
        elif has_critical:
            result_type = "critical_win"
        else:
            result_type = "success"
    else:
        result_type = "bestial_failure" if has_hunger_one else "failure"

    return RollResponse(
        regular_dice=regular_dice,
        hunger_dice=hunger_dice,
        successes=successes,
        result_type=result_type,
        difficulty_met=difficulty_met,
        margin=successes - difficulty,
    )

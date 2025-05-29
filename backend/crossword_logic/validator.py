from .models import ValidationRequest, ValidationResponse
from .generator import get_full_puzzle_data

def validate_answer(request: ValidationRequest) -> ValidationResponse:
    puzzle_data = get_full_puzzle_data()
    found_word = None
    for word in puzzle_data.words:
        if word.number == request.number and word.direction == request.direction:
            found_word = word
            break

    if not found_word:
        return ValidationResponse(correct=False)

    is_correct = found_word.answer.upper() == request.attempt.upper()

    if is_correct:
        return ValidationResponse(
            correct=True,
            answer=found_word.answer,
            silent_indices=found_word.silent_indices
        )
    else:
        return ValidationResponse(correct=False)
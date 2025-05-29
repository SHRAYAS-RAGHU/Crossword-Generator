from __future__ import annotations

from typing import List, Tuple, Literal
from .models import WordClue, CrosswordPuzzleData
import random

GRID_SIZE = 15  # max grid dimensions, can be shrunk later

def place_words_in_grid(clue_answer_list: List[Tuple[str, str]]) -> CrosswordPuzzleData:
    grid = [["" for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    placed_words: List[WordClue] = []
    word_number = 1

    def can_place(word: str, r: int, c: int, dir: Literal["across", "down"]) -> bool:
        for i, ch in enumerate(word):
            rr, cc = (r, c + i) if dir == "across" else (r + i, c)
            if rr >= GRID_SIZE or cc >= GRID_SIZE:
                return False
            cell = grid[rr][cc]
            if cell != "" and cell != ch:
                return False
        return True

    def do_place(word: str, r: int, c: int, dir: Literal["across", "down"]):
        for i, ch in enumerate(word):
            rr, cc = (r, c + i) if dir == "across" else (r + i, c)
            grid[rr][cc] = ch

    def find_best_position(word: str) -> Tuple[int, int, str] | None:
        for existing in placed_words:
            existing_word = existing.answer
            for i, ch1 in enumerate(existing_word):
                for j, ch2 in enumerate(word):
                    if ch1 == ch2:
                        # Try intersecting at this letter
                        if existing.direction == "across":
                            r = existing.start_row + j
                            c = existing.start_col + i
                            dir = "down"
                        else:
                            r = existing.start_row + i
                            c = existing.start_col + j
                            dir = "across"
                        if can_place(word, r - j if dir == "across" else r, c - j if dir == "down" else c, dir):
                            return r - j if dir == "across" else r, c - j if dir == "down" else c, dir
        return None

    random.shuffle(clue_answer_list)
    for clue, answer in clue_answer_list:
        answer = answer.lower()
        if not placed_words:
            r, c, dir = 7, 7, "across"
        else:
            result = find_best_position(answer)
            if result is None:
                continue  # skip if no position fits
            r, c, dir = result
        do_place(answer, r, c, dir)
        placed_words.append(WordClue(word_number, clue, answer, dir, r, c))
        word_number += 1

    # Calculate actual grid size
    max_row = max((w.start_row + (len(w.answer) if w.direction == "down" else 1)) for w in placed_words)
    max_col = max((w.start_col + (len(w.answer) if w.direction == "across" else 1)) for w in placed_words)

    return CrosswordPuzzleData(
        title="Silent Letter Crossword",
        grid_dimensions=(max_row, max_col),
        words=placed_words
    )

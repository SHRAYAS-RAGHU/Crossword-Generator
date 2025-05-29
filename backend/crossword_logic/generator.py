from __future__ import annotations

import json
from pathlib import Path
from .models import CrosswordPuzzleData, WordClueClient, CrosswordPuzzleClient

DATA_FILE_PATH = Path(__file__).parent.parent / "data" / "word_list.json"

_puzzle_data: CrosswordPuzzleData | None = None

def _load_puzzle_data() -> CrosswordPuzzleData:
    global _puzzle_data
    if _puzzle_data is None:
        with open(DATA_FILE_PATH, 'r') as f:
            data = json.load(f)
            _puzzle_data = CrosswordPuzzleData(**data)
    return _puzzle_data

def get_crossword_for_client() -> CrosswordPuzzleClient:
    puzzle = _load_puzzle_data()
    client_words = []
    for word_data in puzzle.words:
        client_words.append(
            WordClueClient(
                number=word_data.number,
                clue=word_data.clue,
                direction=word_data.direction,
                start_row=word_data.start_row,
                start_col=word_data.start_col,
                length=len(word_data.answer)
            )
        )
    return CrosswordPuzzleClient(
        title=puzzle.title,
        grid_dimensions=puzzle.grid_dimensions,
        words=client_words
    )

def get_full_puzzle_data() -> CrosswordPuzzleData:
    return _load_puzzle_data()
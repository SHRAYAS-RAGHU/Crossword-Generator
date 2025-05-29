from __future__ import annotations

from pydantic import BaseModel
from typing import List, Dict, Literal

class WordData(BaseModel):
    number: int
    clue: str
    answer: str
    direction: Literal['across', 'down']
    start_row: int
    start_col: int
    silent_indices: List[int]

class GridDimensions(BaseModel):
    rows: int
    cols: int

class CrosswordPuzzleData(BaseModel):
    title: str
    grid_dimensions: GridDimensions
    words: List[WordData]

# For frontend, we don't send the answer initially
class WordClueClient(BaseModel):
    number: int
    clue: str
    direction: Literal['across', 'down']
    start_row: int
    start_col: int
    length: int

class CrosswordPuzzleClient(BaseModel):
    title: str
    grid_dimensions: GridDimensions
    words: List[WordClueClient]

class ValidationRequest(BaseModel):
    number: int
    direction: Literal['across', 'down']
    attempt: str

class ValidationResponse(BaseModel):
    correct: bool
    answer: str
    silent_indices: List[int]

class WordClue:
    number: int
    clue: str
    answer: str
    direction: Literal["across", "down"]
    start_row: int
    start_col: int
    silent_indices: List[int]


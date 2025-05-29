export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface WordClue {
  number: number;
  clue: string;
  direction: 'across' | 'down';
  start_row: number;
  start_col: number;
  length: number;
  answer?: string; // Revealed answer
  user_input?: string[]; // For current user input
  is_correct?: boolean; // If the word has been correctly answered
  silent_indices?: number[]; // For highlighting silent letters
}

export interface CrosswordPuzzle {
  title: string;
  grid_dimensions: GridDimensions;
  words: WordClue[];
}

export interface ValidationRequestPayload {
  number: number;
  direction: 'across' | 'down';
  attempt: string;
}

export interface ValidationResponsePayload {
  correct: boolean;
  answer?: string;
  silent_indices?: number[];
}

// For the grid component cells
export interface Cell {
  char: string; // Display character (letter or number for clue start)
  isInput: boolean;
  row: number;
  col: number;
  wordRefs: WordRef[]; // Could be part of multiple words (intersection)
  isWordStart?: boolean; // True if this cell is the start of a word
  clueNumber?: number; // Display clue number in the cell
  value: string; // Actual letter input by user or revealed
  isSilent?: boolean; // If this letter is silent (after reveal)
  isCorrect?: boolean; // If this letter is part of a correctly answered word
  isDisabled?: boolean; // if part of a correctly answered word
}

export interface WordRef {
  wordNumber: number;
  direction: 'across' | 'down';
  indexInWord: number; // 0-based index of this cell's letter within the word
}
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CrosswordPuzzle, WordClue, Cell, WordRef } from '../../models/crossword.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crossword-grid',
  templateUrl: './crossword-grid.component.html',
  styleUrls: ['./crossword-grid.component.scss'],
  standalone: false
})
export class CrosswordGridComponent implements OnInit, OnChanges {
  @Input() puzzleData: CrosswordPuzzle | null = null;
  @Output() cellValueChanged = new EventEmitter<{ wordClue: WordClue, fullAttempt: string }>();
  @Output() wordFocus = new EventEmitter<WordClue>();

  @ViewChildren('inputCell') inputCells!: QueryList<ElementRef<HTMLInputElement>>;


  grid: Cell[][] = [];
  currentFocus: { row: number, col: number } | null = null;

  ngOnInit(): void {
    this.initializeGrid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['puzzleData'] && this.puzzleData) {
      this.initializeGrid();
    }
  }

  initializeGrid(): void {
    if (!this.puzzleData) return;

    const { rows, cols } = this.puzzleData.grid_dimensions;
    this.grid = Array(rows).fill(null).map((_, r) =>
      Array(cols).fill(null).map((_, c) => ({
        char: '',
        isInput: false,
        row: r,
        col: c,
        wordRefs: [],
        value: '',
        isWordStart: false
      }))
    );

    this.puzzleData.words.forEach(word => {
      // Initialize user_input if not present
      if (!word.user_input) {
        word.user_input = Array(word.length).fill('');
      }

      for (let i = 0; i < word.length; i++) {
        let r = word.start_row;
        let c = word.start_col;

        if (word.direction === 'across') {
          c += i;
        } else { // 'down'
          r += i;
        }

        if (r < rows && c < cols) {
          this.grid[r][c].isInput = true;
          const wordRef: WordRef = { wordNumber: word.number, direction: word.direction, indexInWord: i };
          this.grid[r][c].wordRefs.push(wordRef);

          if (i === 0) {
            this.grid[r][c].isWordStart = true;
            this.grid[r][c].clueNumber = word.number;
          }

          // Populate with revealed answer if available
          if (word.is_correct && word.answer) {
            this.grid[r][c].value = word.answer[i];
            this.grid[r][c].isDisabled = true;
            if (word.silent_indices?.includes(i)) {
                this.grid[r][c].isSilent = true;
            }
          } else if (word.user_input && word.user_input[i]) {
            this.grid[r][c].value = word.user_input[i];
          }
        }
      }
    });
  }

  getCellId(row: number, col: number): string {
    return `cell-${row}-${col}`;
  }

  onCellFocus(cell: Cell): void {
    this.currentFocus = { row: cell.row, col: cell.col };
    // Try to determine the primary word for this cell (e.g., the 'across' one if intersection)
    // Or the one that starts here, or the first one in its wordRefs
    const mainWordRef = cell.wordRefs.find(ref => ref.direction === 'across') || cell.wordRefs[0];
    if (mainWordRef) {
      const focusedWord = this.puzzleData?.words.find(w => w.number === mainWordRef.wordNumber && w.direction === mainWordRef.direction);
      if (focusedWord && !focusedWord.is_correct) {
        this.wordFocus.emit(focusedWord);
      }
    }
  }

  onCellInput(event: Event, cell: Cell): void {
    if (cell.isDisabled) return;

    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toUpperCase();
    cell.value = value.length > 0 ? value[0] : ''; // Single character
    inputElement.value = cell.value; // Ensure view reflects model

    // Update all words this cell belongs to
    cell.wordRefs.forEach(ref => {
      const word = this.puzzleData?.words.find(w => w.number === ref.wordNumber && w.direction === ref.direction);
      if (word && !word.is_correct) {
        if (!word.user_input) {
            word.user_input = Array(word.length).fill('');
        }
        word.user_input[ref.indexInWord] = cell.value;

        // Check if word is complete
        if (word.user_input.every(char => char.length === 1)) {
          this.cellValueChanged.emit({ wordClue: word, fullAttempt: word.user_input.join('') });
        }
      }
    });

    // Auto-tab
    if (cell.value.length === 1) {
      this.moveToNextCell(cell);
    }
  }

  moveToNextCell(currentCell: Cell): void {
    // Determine primary direction (e.g. based on focused word or an 'across' preference)
    const primaryWordRef = currentCell.wordRefs.find(ref => {
      const word = this.puzzleData?.words.find(w => w.number === ref.wordNumber && w.direction === ref.direction);
      return word && !word.is_correct; // Focus on active words
    }) || currentCell.wordRefs[0];


    if (!primaryWordRef) return;

    const word = this.puzzleData?.words.find(w => w.number === primaryWordRef.wordNumber && w.direction === primaryWordRef.direction);
    if (!word || word.is_correct) return;


    let nextRow = currentCell.row;
    let nextCol = currentCell.col;
    let nextIndexInWord = primaryWordRef.indexInWord + 1;

    if (nextIndexInWord < word.length) {
      if (primaryWordRef.direction === 'across') {
        nextCol = word.start_col + nextIndexInWord;
      } else { // down
        nextRow = word.start_row + nextIndexInWord;
      }

      const nextCellId = this.getCellId(nextRow, nextCol);
      const nextInputElement = this.inputCells.find(el => el.nativeElement.id === nextCellId);
      nextInputElement?.nativeElement.focus();
      nextInputElement?.nativeElement.select();
    }
  }

  handleKeyDown(event: KeyboardEvent, cell: Cell): void {
    if (cell.isDisabled) return;

    let newRow = cell.row;
    let newCol = cell.col;

    switch (event.key) {
      case 'ArrowUp':
        newRow = Math.max(0, cell.row - 1);
        event.preventDefault();
        break;
      case 'ArrowDown':
        newRow = Math.min(this.puzzleData!.grid_dimensions.rows - 1, cell.row + 1);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, cell.col - 1);
        event.preventDefault();
        break;
      case 'ArrowRight':
        newCol = Math.min(this.puzzleData!.grid_dimensions.cols - 1, cell.col + 1);
        event.preventDefault();
        break;
      case 'Backspace':
        if (!cell.value) { // If current cell is empty, move to previous
            this.moveToPreviousCell(cell);
            event.preventDefault();
        }
        return; // Allow default backspace if cell has value
      case 'Enter':
        // Could trigger validation for the current word
        event.preventDefault();
        return;
      default:
        return; // For other keys (like letters), let onCellInput handle it
    }

    // Check if the target cell is an input cell
    if (this.grid[newRow][newCol].isInput && !this.grid[newRow][newCol].isDisabled) {
        const targetCellId = this.getCellId(newRow, newCol);
        const targetInputElement = this.inputCells.find(el => el.nativeElement.id === targetCellId);
        targetInputElement?.nativeElement.focus();
        targetInputElement?.nativeElement.select();
    }
  }

  moveToPreviousCell(currentCell: Cell): void {
    const primaryWordRef = currentCell.wordRefs.find(ref => {
      const word = this.puzzleData?.words.find(w => w.number === ref.wordNumber && w.direction === ref.direction);
      return word && !word.is_correct;
    }) || currentCell.wordRefs[0];

    if (!primaryWordRef) return;

    const word = this.puzzleData?.words.find(w => w.number === primaryWordRef.wordNumber && w.direction === primaryWordRef.direction);
    if (!word || word.is_correct) return;

    let prevRow = currentCell.row;
    let prevCol = currentCell.col;
    let prevIndexInWord = primaryWordRef.indexInWord - 1;

    if (prevIndexInWord >= 0) {
      if (primaryWordRef.direction === 'across') {
        prevCol = word.start_col + prevIndexInWord;
      } else { // down
        prevRow = word.start_row + prevIndexInWord;
      }
      const prevCellId = this.getCellId(prevRow, prevCol);
      const prevInputElement = this.inputCells.find(el => el.nativeElement.id === prevCellId);
      prevInputElement?.nativeElement.focus();
      prevInputElement?.nativeElement.select();
    }
  }

  // Method to update grid when a word is validated (called from parent component)
  updateWordInGrid(validatedWord: WordClue): void {
    if (!this.puzzleData) return;

    const wordInPuzzle = this.puzzleData.words.find(
      w => w.number === validatedWord.number && w.direction === validatedWord.direction
    );

    if (wordInPuzzle) {
      wordInPuzzle.is_correct = validatedWord.is_correct;
      wordInPuzzle.answer = validatedWord.answer; // Full answer
      wordInPuzzle.silent_indices = validatedWord.silent_indices;

      // Re-initialize or update specific cells. For simplicity, re-initializing.
      // A more optimized approach would update only the affected cells.
      this.initializeGrid();
    }
  }
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { CrosswordService } from './services/crossword.service';
import { CrosswordPuzzle, WordClue, ValidationResponsePayload } from './models/crossword.model';
import { CrosswordGridComponent } from './components/crossword-grid/crossword-grid.component'; // Import grid component
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { HintsComponent } from './components/hints/hints.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'Crossword Puzzle';
  puzzle: CrosswordPuzzle | null = null;
  acrossClues: WordClue[] = [];
  downClues: WordClue[] = [];
  currentFocusedClue: WordClue | null = null;
  errorMessage: string | null = null;

  @ViewChild(CrosswordGridComponent) crosswordGridComponent!: CrosswordGridComponent;


  constructor(private crosswordService: CrosswordService) {}

  ngOnInit(): void {
    this.loadCrossword();
  }

  loadCrossword(): void {
    this.errorMessage = null;
    this.crosswordService.getCrosswordPuzzle().subscribe({
      next: (data) => {
        this.puzzle = data;
        this.puzzle.words.forEach(word => {
            word.user_input = Array(word.length).fill(''); // Initialize user_input
        });
        this.acrossClues = data.words.filter(w => w.direction === 'across').sort((a, b) => a.number - b.number);
        this.downClues = data.words.filter(w => w.direction === 'down').sort((a, b) => a.number - b.number);
      },
      error: (err) => {
        console.error('Failed to load crossword', err);
        this.errorMessage = 'Failed to load crossword puzzle. Please try again later.';
      }
    });
  }

  handleCellVaueChanged(event: { wordClue: WordClue, fullAttempt: string }): void {
    const { wordClue, fullAttempt } = event;
    if (wordClue.is_correct) return; // Don't re-validate correct words

    this.crosswordService.validateAnswer({
      number: wordClue.number,
      direction: wordClue.direction,
      attempt: fullAttempt
    }).subscribe({
      next: (response: ValidationResponsePayload) => {
        if (response.correct) {
          const originalWord = this.puzzle?.words.find(w => w.number === wordClue.number && w.direction === wordClue.direction);
          if (originalWord) {
            originalWord.is_correct = true;
            originalWord.answer = response.answer; // Backend sends full answer
            originalWord.silent_indices = response.silent_indices;
            // Update the grid component
            if (this.crosswordGridComponent) {
              this.crosswordGridComponent.updateWordInGrid(originalWord);
            }
            // Update clue lists
            this.acrossClues = [...this.acrossClues];
            this.downClues = [...this.downClues];
          }
        } else {
          // Optionally provide feedback for incorrect attempt
          console.log(`Word ${wordClue.number} ${wordClue.direction} is incorrect.`);
        }
      },
      error: (err) => console.error('Validation error', err)
    });
  }

  handleClueSelected(clue: WordClue): void {
    this.currentFocusedClue = clue;
    // Logic to focus the first cell of this clue in the grid
    // This requires communication with the grid component, e.g., via a method call or an Input property
    // For simplicity, we're just logging it here.
    // You might need to find the specific cell in the grid component and call .focus() on its input element.
    if (this.crosswordGridComponent) {
        const firstCell = this.crosswordGridComponent.grid[clue.start_row][clue.start_col];
        const cellId = this.crosswordGridComponent.getCellId(firstCell.row, firstCell.col);
        const inputElement = this.crosswordGridComponent.inputCells.find(el => el.nativeElement.id === cellId);
        inputElement?.nativeElement.focus();
        inputElement?.nativeElement.select();
    }
    console.log('Clue selected:', clue);
  }

  handleWordFocus(clue: WordClue): void {
    this.currentFocusedClue = clue;
  }
}
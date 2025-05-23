import { Component, OnInit } from '@angular/core';
import { CrosswordService } from '../services/crossword.service';

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.css']
})
export class CrosswordComponent implements OnInit {
  gridSize = 10;
  grid: any[][] = [];
  words: any[] = [];
  userGrid: string[][] = [];
  results: any = {};

  constructor(private crosswordService: CrosswordService) {}

  ngOnInit() {
    this.crosswordService.getCrossword().subscribe(data => {
      this.gridSize = data.grid_size;
      this.words = data.words;
      this.initGrid();
    });
  }

  initGrid() {
    this.userGrid = Array(this.gridSize).fill(null).map(() =>
      Array(this.gridSize).fill('')
    );
  }

  onInput(event: any, row: number, col: number) {
    const val = event.target.value;
    this.userGrid[row][col] = val.length > 1 ? val[val.length - 1] : val;
  }

  getLetter(row: number, col: number): string {
    return this.userGrid[row][col] || '';
  }

  isCellUsed(row: number, col: number): boolean {
    return this.words.some(word => {
      for (let i = 0; i < word.answer.length; i++) {
        const r = word.row + (word.direction === 'down' ? i : 0);
        const c = word.col + (word.direction === 'across' ? i : 0);
        if (r === row && c === col) return true;
      }
      return false;
    });
  }

  submit() {
    const answers = this.words.map(w => {
      let word = '';
      for (let i = 0; i < w.answer.length; i++) {
        const r = w.row + (w.direction === 'down' ? i : 0);
        const c = w.col + (w.direction === 'across' ? i : 0);
        word += this.userGrid[r][c] || '';
      }
      return {
        id: w.id,
        userAnswer: word,
        correctAnswer: w.answer
      };
    });

    this.crosswordService.validateAnswers(answers).subscribe(res => {
      this.results = res.correct;
    });
  }

  isCorrect(wordId: number): boolean | null {
    return this.results[wordId];
  }
}

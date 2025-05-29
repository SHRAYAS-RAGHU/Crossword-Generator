import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WordClue } from '../../models/crossword.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hints',
  standalone: false,
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.scss']
})
export class HintsComponent {
  @Input() title: string = '';
  @Input() acrossClues: WordClue[] = [];
  @Input() downClues: WordClue[] = [];
  @Output() clueSelected = new EventEmitter<WordClue>();

  onClueClick(clue: WordClue): void {
    this.clueSelected.emit(clue);
  }
}
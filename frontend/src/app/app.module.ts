import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Required for ngModel

// App Component
import { AppComponent } from './app.component';

// Custom Components
import { CrosswordGridComponent } from './components/crossword-grid/crossword-grid.component';
import { HintsComponent } from './components/hints/hints.component';
//import { CrosswordGridModule } from './components/crossword-grid/crossword-grid.module';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';

// Services - CrosswordService is provided in 'root'

@NgModule({
  declarations: [
    AppComponent,
    HintsComponent,
    CrosswordGridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    // CrosswordService is already provided in root if @Injectable({ providedIn: 'root' }) is used.
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
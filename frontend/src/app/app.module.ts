import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { CrosswordService } from './services/crossword.service';

@NgModule({
  declarations: [AppComponent, CrosswordComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [CrosswordService],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AppModule } from './app/app.module'; // Import AppModule
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
import { initializePicard } from 'picard-js/client';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

Promise.all([
  bootstrapApplication(AppComponent, appConfig),
  initializePicard({
    feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  }),
]).catch((err) => console.error(err));

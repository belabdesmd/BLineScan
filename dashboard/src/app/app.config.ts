import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {NgCircleProgressModule} from 'ng-circle-progress';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    ...(NgCircleProgressModule.forRoot({
      radius: 60,
      outerStrokeWidth: 10,
      innerStrokeWidth: 5,
      outerStrokeColor: "#4CAF50",
      innerStrokeColor: "#e0e0e0",
      animationDuration: 300,
      showUnits: false,
      showSubtitle: false,
    }).providers!),
    provideHttpClient()
  ]
};

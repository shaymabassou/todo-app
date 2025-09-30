
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { taskReducer } from './store/task.reducer';
import { TaskEffects } from './store/task.effects';
import { TaskService } from './services/task.service';

export const appConfig = {
  providers: [
    provideRouter(routes),
    TaskService,
    provideHttpClient(),
    provideStore({ tasks: taskReducer }),
    provideEffects([TaskEffects]),
  ],
};
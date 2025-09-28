import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { TaskService } from '../services/task.service';
import * as TaskActions from './task.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TaskEffects {

  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks })),
          catchError(error => {
            console.error('Error loading tasks:', error);
            return of(TaskActions.loadTasksSuccess({ tasks: [] }));
          })
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(action =>
        this.taskService.addTask(action.task).pipe(
          map(task => TaskActions.addTaskSuccess({ task })),
          catchError(error => {
            console.error('Error adding task:', error);
            return of(TaskActions.addTaskSuccess({ task: action.task }));
          })
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(action =>
        this.taskService.updateTask(action.task).pipe(
          map(task => TaskActions.updateTaskSuccess({ task })),
          catchError(error => {
            console.error('Error updating task:', error);
            return of(TaskActions.updateTaskSuccess({ task: action.task }));
          })
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(action =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id: action.id })),
          catchError(error => {
            console.error('Error deleting task:', error);
            return of(TaskActions.deleteTaskSuccess({ id: action.id }));
          })
        )
      )
    )
  );
}
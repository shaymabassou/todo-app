import { createReducer, on } from '@ngrx/store';
import * as TaskActions from './task.actions';
import { Task } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const taskReducer = createReducer(
  initialState,
  

  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
    error: null
  })),

  on(TaskActions.addTask, (state, { task }) => {
    console.log('Reducer: Adding task', task);
    return {
      ...state,
      tasks: [...state.tasks, task],// <--- l'etat en ajoutant la tache a la liste 
      error: null
    };
  }),
  

  on(TaskActions.addTaskSuccess, (state, { task }) => {
    console.log('Reducer: Task added successfully', task);
  
    const exists = state.tasks.some(t => t.id === task.id);
    if (!exists) {
      return {
        ...state,
        tasks: [...state.tasks, task],
        error: null,
      };
    }
    return state;
  }),


  on(TaskActions.updateTask, (state, { task }) => {
    console.log('Reducer: Updating task', task);
    return {
      ...state,
      tasks: state.tasks.map(t => t.id === task.id ? task : t),
      error: null,
    };
  }),
  
  on(TaskActions.updateTaskSuccess, (state, { task }) => {
    console.log('Reducer: Task updated successfully', task);
    return {
      ...state,
      tasks: state.tasks.map(t => t.id === task.id ? task : t),
      error: null,
    };
  }),


  on(TaskActions.deleteTask, (state, { id }) => {
    console.log('Reducer: Deleting task', id);
    return {
      ...state,
      tasks: state.tasks.filter(t => t.id !== id),
      error: null,
    };
  }),
  
  on(TaskActions.deleteTaskSuccess, (state, { id }) => {
    console.log('Reducer: Task deleted successfully', id);
    return {
      ...state,
      tasks: state.tasks.filter(t => t.id !== id),
      error: null,
    };
  }),


  on(TaskActions.logout, (state) => {
    console.log('Reducer: Logout, clearing tasks');
    return {
      ...state,
      tasks: [],
      loading: false,
      error: null
    };
  })
);
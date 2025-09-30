
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private user: string | null = null;

  // Getter pour accéder à user
  get currentUser(): string | null {
    return this.user;
  }

  setUser(email: string) {
    console.log('Setting user:', email);
    this.user = email;// Email stocké dans le service
  }

  clearUser() {
    const currentUser = this.user;
    this.user = null;
    
    if (currentUser) {
      localStorage.removeItem(`tasks_${currentUser}`);
    }
  }
// les methodes d crud
  getTasks(): Observable<Task[]> {
    if (!this.currentUser) {
      return of([]);
    }
    
    const savedTasks = localStorage.getItem(`tasks_${this.currentUser}`);
    const tasks = savedTasks ? JSON.parse(savedTasks) : [];
    console.log('Loading tasks from localStorage:', tasks);
    return of(tasks);
  }

  addTask(task: Task): Observable<Task> {
    if (!this.currentUser) {
      return of(task);
    }

    const newTask = { 
      ...task, 
      id: task.id || Date.now(), 
      user: this.currentUser, 
      completed: task.completed || false 
    };
    
    
    const existingTasks = this.getTasksFromStorage();
    existingTasks.push(newTask);
    
  
    this.saveTasksToStorage(existingTasks);
    console.log('Task added to localStorage:', newTask);
    
    return of(newTask);
  }

  updateTask(task: Task): Observable<Task> {
    if (!this.currentUser) {
      return of(task);
    }

    const tasks = this.getTasksFromStorage();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      tasks[index] = { ...task, user: this.currentUser };
      this.saveTasksToStorage(tasks);
      console.log('Task updated in localStorage:', task);
    }
    
    return of(task);
  }

  deleteTask(id: number): Observable<void> {
    if (!this.currentUser) {
      return of();
    }

    const tasks = this.getTasksFromStorage();
    const filteredTasks = tasks.filter(t => t.id !== id);
    
    this.saveTasksToStorage(filteredTasks);
    console.log('Task deleted from localStorage:', id);
    
    return of();
  }

  private getTasksFromStorage(): Task[] {
    if (!this.currentUser) return [];
    
    const savedTasks = localStorage.getItem(`tasks_${this.currentUser}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  private saveTasksToStorage(tasks: Task[]) {
    if (!this.currentUser) return;
    
    localStorage.setItem(`tasks_${this.currentUser}`, JSON.stringify(tasks));
  }
}
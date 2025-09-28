import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';

export const authGuard = () => {
  const taskService = inject(TaskService);
  const router = inject(Router);
  
  if (taskService.currentUser) {
    console.log('User authenticated:', taskService.currentUser);
    return true;
  } else {
    console.log('No user logged in, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
};
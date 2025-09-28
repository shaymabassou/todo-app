import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadTasks } from '../../store/task.actions';
import { TaskState } from '../../store/task.reducer';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1>Connexion</h1>
          <p>Entrez votre email pour accéder à vos tâches</p>
        </div>
        
        <form class="login-form" (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email" 
              [(ngModel)]="email"
              name="email"
              class="form-input"
              placeholder="votre@email.com"
              required
              autocomplete="email"
            />
          </div>
          
          <button 
            type="submit" 
            class="login-button"
            [disabled]="!email || email.trim() === ''"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Se connecter
          </button>
        </form>

        <div class="login-footer">
          <p>Application de gestion de tâches</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: calc(100vh - 4rem);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.02));
    }

    .login-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(99, 102, 241, 0.05);
      border: 1px solid rgba(229, 231, 235, 0.8);
      position: relative;
      overflow: hidden;
    }

    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #818cf8, #a855f7);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: white;
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
    }

    .login-header h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .login-header p {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
      background: #f9fafb;
      outline: none;
    }

    .form-input:focus {
      border-color: #6366f1;
      background: white;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .login-button {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
    }

    .login-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .login-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.1);
    }

    .login-footer {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid #f3f4f6;
    }

    .login-footer p {
      color: #9ca3af;
      font-size: 0.75rem;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Animation d'entrée */
    .login-card {
      animation: slideInUp 0.6s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-container {
        padding: 1rem;
      }
      
      .login-card {
        padding: 2rem 1.5rem;
        border-radius: 1rem;
      }
      
      .login-icon {
        width: 70px;
        height: 70px;
      }
      
      .login-header h1 {
        font-size: 1.625rem;
      }
    }

    /* Focus visible pour accessibilité */
    .login-button:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }

    .form-input:focus-visible {
      outline: none;
    }
  `]
})
export class LoginComponent {
  email: string = '';

  constructor(
    private router: Router, 
    private store: Store<TaskState>, 
    private taskService: TaskService
  ) {}

  login() {
    if (this.email && this.email.trim()) {
      console.log('Login with email:', this.email);
      this.taskService.setUser(this.email.trim());
      this.store.dispatch(loadTasks());
      this.router.navigate(['/tasks']);
    }
  }
}
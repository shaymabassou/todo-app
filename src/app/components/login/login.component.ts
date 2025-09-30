
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
      <!-- Animated Background Elements -->
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>

      <div class="login-card">
        <!-- Glow Effect -->
        <div class="card-glow"></div>
        
        <div class="login-header">
          <div class="login-icon">
            <div class="icon-inner">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <h1>Bienvenue sur TaskFlow</h1>
          <p>Connectez-vous pour gérer vos tâches efficacement</p>
        </div>
        
        <form class="login-form" (ngSubmit)="login()">
          <div class="form-group">
            <label for="email" class="form-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              Adresse Email
            </label>
            <div class="input-wrapper">
              <input 
                id="email"
                type="email" 
                [(ngModel)]="email"
                name="email"
                class="form-input"
                [class.input-error]="showError"
                [class.input-success]="email && isValidEmail() && !showError"
                placeholder="exemple@domaine.com"
                required
                autocomplete="email"
                (blur)="validateEmail()"
                (input)="onEmailInput()"
              />
              <div class="input-icon" *ngIf="email && isValidEmail() && !showError">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div class="error-message" *ngIf="showError">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              <span>Veuillez entrer une adresse email valide</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="login-button"
            [disabled]="!isValidEmail()"
          >
            <span class="button-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              Se connecter
            </span>
            <div class="button-shine"></div>
          </button>
        </form>

        <div class="login-footer">
          <div class="footer-divider">
            <span>Application sécurisée</span>
          </div>
          <div class="footer-features">
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              <span>Gestion simplifiée</span>
            </div>
            <div class="feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>
              <span>Données protégées</span>
            </div>
          </div>
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
      position: relative;
      overflow: hidden;
    }

    /* Floating Shapes Animation */
    .floating-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 20s ease-in-out infinite;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      top: -150px;
      left: -150px;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 250px;
      height: 250px;
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      top: 50%;
      right: -125px;
      animation-delay: -5s;
    }

    .shape-3 {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #f59e0b, #fb923c);
      bottom: -100px;
      left: 30%;
      animation-delay: -10s;
    }

    .shape-4 {
      width: 280px;
      height: 280px;
      background: linear-gradient(135deg, #14b8a6, #10b981);
      bottom: 20%;
      right: 20%;
      animation-delay: -15s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(30px, -30px) scale(1.1);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      75% {
        transform: translate(20px, 30px) scale(1.05);
      }
    }

    /* Login Card */
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      padding: 3rem 2.5rem;
      width: 100%;
      max-width: 460px;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.1),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
      position: relative;
      z-index: 10;
      animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%);
      animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Header */
    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
      position: relative;
      z-index: 1;
    }

    .login-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 1.5rem;
      position: relative;
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .icon-inner {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      border-radius: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 
        0 10px 30px rgba(139, 92, 246, 0.4),
        0 0 0 8px rgba(139, 92, 246, 0.1),
        0 0 0 16px rgba(139, 92, 246, 0.05);
      position: relative;
      overflow: hidden;
    }

    .icon-inner::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shine 3s ease-in-out infinite;
    }

    @keyframes shine {
      0%, 100% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
      }
      50% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    .login-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .login-header p {
      color: #6b7280;
      font-size: 0.9375rem;
      margin: 0;
      line-height: 1.6;
      font-weight: 500;
    }

    /* Form */
    .login-form {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-label svg {
      color: #8b5cf6;
    }

    .input-wrapper {
      position: relative;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1.25rem;
      padding-right: 3rem;
      font-size: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      outline: none;
      font-weight: 500;
    }

    .form-input:focus {
      border-color: #8b5cf6;
      background: white;
      box-shadow: 
        0 0 0 4px rgba(139, 92, 246, 0.1),
        0 4px 12px rgba(139, 92, 246, 0.15);
      transform: translateY(-1px);
    }

    .form-input.input-error {
      border-color: #ef4444;
      background: #fef2f2;
      animation: shake 0.4s ease-in-out;
    }

    .form-input.input-success {
      border-color: #14b8a6;
      background: #f0fdfa;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }

    .form-input::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    .input-icon {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #14b8a6;
      animation: checkmark 0.5s ease-out;
    }

    @keyframes checkmark {
      0% {
        opacity: 0;
        transform: translateY(-50%) scale(0);
      }
      50% {
        transform: translateY(-50%) scale(1.2);
      }
      100% {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
    }

    .error-message {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-top: 0.75rem;
      padding: 0.75rem;
      background: #fef2f2;
      border-left: 3px solid #ef4444;
      border-radius: 0.5rem;
      color: #dc2626;
      font-size: 0.8125rem;
      font-weight: 500;
      animation: slideDown 0.3s ease-out;
    }

    .error-message svg {
      flex-shrink: 0;
      margin-top: 1px;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Button */
    .login-button {
      width: 100%;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      color: white;
      border: none;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 
        0 10px 25px rgba(139, 92, 246, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      position: relative;
      z-index: 1;
    }

    .button-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .login-button:hover:not(:disabled) .button-shine {
      left: 100%;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 
        0 15px 35px rgba(139, 92, 246, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .login-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .login-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }

    /* Footer */
    .login-footer {
      position: relative;
      z-index: 1;
    }

    .footer-divider {
      position: relative;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .footer-divider::before,
    .footer-divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: calc(50% - 80px);
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    }

    .footer-divider::before {
      left: 0;
    }

    .footer-divider::after {
      right: 0;
    }

    .footer-divider span {
      display: inline-block;
      padding: 0 1rem;
      color: #9ca3af;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: rgba(255, 255, 255, 0.95);
    }

    .footer-features {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .feature svg {
      color: #8b5cf6;
      flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-container {
        padding: 1rem;
      }
      
      .login-card {
        padding: 2rem 1.5rem;
        border-radius: 1.5rem;
      }
      
      .login-icon {
        width: 80px;
        height: 80px;
      }
      
      .login-header h1 {
        font-size: 1.75rem;
      }

      .login-header p {
        font-size: 0.875rem;
      }

      .footer-features {
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
      }

      .footer-divider::before,
      .footer-divider::after {
        width: calc(50% - 65px);
      }
    }

    /* Focus visible pour accessibilité */
    .login-button:focus-visible {
      outline: 3px solid #8b5cf6;
      outline-offset: 3px;
    }

    .form-input:focus-visible {
      outline: none;
    }
  `]
})
export class LoginComponent {
  email: string = ''; // <- juste champs email
  showError: boolean = false;

  constructor(
    private router: Router, 
    private store: Store<TaskState>, 
    private taskService: TaskService
  ) {}

  isValidEmail(): boolean {
    if (!this.email || this.email.trim() === '') {
      return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email.trim());
  }

  onEmailInput() {
    this.showError = false;
  }

  validateEmail() {
    if (this.email && this.email.trim() !== '' && !this.isValidEmail()) {
      this.showError = true;
    }
  }

  login() {
    if (this.isValidEmail()) {
      console.log('Login with email:', this.email);
      this.taskService.setUser(this.email.trim());//<--// Stocke l'email dans  task service
      this.store.dispatch(loadTasks());
      this.router.navigate(['/tasks']);//<-- redirige vers la liste des tache
    } else {
      this.showError = true;
    }
  }
}
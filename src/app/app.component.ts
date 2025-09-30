import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <!-- Navigation Header -->
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <div class="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 class="logo-text">TaskFlow</h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Background Decorations -->
      <div class="bg-decoration decoration-1"></div>
      <div class="bg-decoration decoration-2"></div>
      <div class="bg-decoration decoration-3"></div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #8b5cf6;
      --primary-dark: #7c3aed;
      --primary-light: #a78bfa;
      --secondary-color: #ec4899;
      --success-color: #14b8a6;
      --danger-color: #f43f5e;
      --warning-color: #f59e0b;
      --accent-cyan: #06b6d4;
      --accent-orange: #fb923c;
      --gray-50: #fafafa;
      --gray-100: #f4f4f5;
      --gray-200: #e4e4e7;
      --gray-300: #d4d4d8;
      --gray-400: #a1a1aa;
      --gray-500: #71717a;
      --gray-600: #52525b;
      --gray-700: #3f3f46;
      --gray-800: #27272a;
      --gray-900: #18181b;
      --white: #ffffff;
      
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      --shadow-colored: 0 20px 25px -5px rgb(139 92 246 / 0.3), 0 8px 10px -6px rgb(139 92 246 / 0.2);
      
      --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
      --gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      --gradient-success: linear-gradient(135deg, #14b8a6 0%, #10b981 100%);
      --gradient-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    * {
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%);
      position: relative;
      overflow-x: hidden;
    }

    .app-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--gray-200);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: var(--gradient-primary);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-colored);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--gradient-primary);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .main-content {
      position: relative;
      z-index: 1;
    }

    .bg-decoration {
      position: fixed;
      border-radius: 50%;
      z-index: 0;
      animation: float 6s ease-in-out infinite;
      filter: blur(60px);
      opacity: 0.4;
    }

    .decoration-1 {
      width: 400px;
      height: 400px;
      top: -200px;
      right: -200px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(236, 72, 153, 0.2));
      animation-delay: 0s;
    }

    .decoration-2 {
      width: 300px;
      height: 300px;
      bottom: -150px;
      left: -150px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.2));
      animation-delay: -2s;
    }

    .decoration-3 {
      width: 250px;
      height: 250px;
      top: 40%;
      right: -125px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.3), rgba(251, 146, 60, 0.2));
      animation-delay: -4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
      }
    }

    /* Global Styles pour toute l'application */
    :host ::ng-deep {
      /* Styles pour les boutons */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        text-decoration: none;
        gap: 0.5rem;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-primary {
        background: var(--gradient-primary);
        color: white;
        box-shadow: var(--shadow-colored);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-xl);
      }

      .btn-success {
        background: var(--gradient-success);
        color: white;
        box-shadow: 0 4px 6px rgba(20, 184, 166, 0.3);
      }

      .btn-success:hover:not(:disabled) {
        background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
        transform: translateY(-1px);
      }

      .btn-warning {
        background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%);
        color: white;
        box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
      }

      .btn-warning:hover:not(:disabled) {
        background: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
        transform: translateY(-1px);
      }

      .btn-danger {
        background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
        color: white;
        box-shadow: 0 4px 6px rgba(244, 63, 94, 0.3);
      }

      .btn-danger:hover:not(:disabled) {
        background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
        transform: translateY(-1px);
      }

      .btn-outline-primary {
        background: transparent;
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
      }

      .btn-outline-primary:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
        transform: translateY(-1px);
      }

      /* Styles pour les cartes */
      .card {
        background: white;
        border-radius: 1rem;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--gray-200);
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
      }

      .card-body {
        padding: 1.5rem;
      }

      /* Styles pour les formulaires */
      .form-control {
        width: 100%;
        padding: 0.75rem;
        font-size: 0.875rem;
        border: 2px solid var(--gray-300);
        border-radius: 0.5rem;
        transition: border-color 0.2s ease-in-out;
        background: white;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }

      .form-control.is-invalid {
        border-color: var(--danger-color);
      }

      .invalid-feedback {
        display: block;
        color: var(--danger-color);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      /* Badges */
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .bg-info {
        background: var(--gradient-primary);
        color: white;
        box-shadow: var(--shadow-colored);
      }

      /* Alerts */
      .alert {
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid transparent;
      }

      .alert-info {
        background: linear-gradient(135deg, #ddd6fe, #c4b5fd);
        color: var(--primary-dark);
        border-color: var(--primary-light);
      }

      /* Utilities */
      .text-center { text-align: center; }
      .text-primary { color: var(--primary-color); }
      .text-muted { color: var(--gray-500); }
      .text-decoration-line-through { text-decoration: line-through; }
      
      .mb-0 { margin-bottom: 0; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .me-1 { margin-right: 0.25rem; }
      .me-2 { margin-right: 0.5rem; }
      .mt-3 { margin-top: 0.75rem; }
      .mt-5 { margin-top: 1.25rem; }
      
      .w-100 { width: 100%; }
      .gap-2 { gap: 0.5rem; }
      
      .d-flex { display: flex; }
      .flex-column { flex-direction: column; }
      .justify-content-between { justify-content: space-between; }
      .align-items-center { align-items: center; }
      
      .btn-group {
        display: flex;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .btn-group .btn:not(:last-child) {
        border-radius: 0;
        margin-right: 1px;
      }
      
      .btn-group .btn:first-child {
        border-top-left-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
      }
      
      .btn-group .btn:last-child {
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }

      /* Spinner */
      .spinner-border {
        width: 2rem;
        height: 2rem;
        border: 0.25em solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spinner-border 0.75s linear infinite;
      }

      @keyframes spinner-border {
        to {
          transform: rotate(360deg);
        }
      }

      .visually-hidden {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      /* Grid system */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        margin: -0.5rem;
      }

      .col-md-4 {
        flex: 0 0 auto;
        width: 100%;
        padding: 0.5rem;
      }

      @media (min-width: 768px) {
        .col-md-4 {
          width: 33.333333%;
        }
      }

      /* Responsive */
      @media (max-width: 768px) {
        .container {
          padding: 0 0.5rem;
        }
        
        .card-body {
          padding: 1rem;
        }
      }
    }
  `]
})
export class AppComponent {
  title = 'TaskFlow';
}
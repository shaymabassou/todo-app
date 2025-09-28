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
      --primary-color: #6366f1;
      --primary-dark: #4f46e5;
      --primary-light: #818cf8;
      --secondary-color: #f59e0b;
      --success-color: #10b981;
      --danger-color: #ef4444;
      --warning-color: #f59e0b;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #111827;
      --white: #ffffff;
      
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      
      --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      --gradient-secondary: linear-gradient(135deg, var(--secondary-color), #fbbf24);
      --gradient-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    * {
      box-sizing: border-box;
    }

    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
      box-shadow: var(--shadow-md);
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
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.05));
      z-index: 0;
      animation: float 6s ease-in-out infinite;
    }

    .decoration-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }

    .decoration-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: -2s;
    }

    .decoration-3 {
      width: 150px;
      height: 150px;
      top: 30%;
      right: -75px;
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
        box-shadow: var(--shadow-md);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-lg);
      }

      .btn-success {
        background: var(--success-color);
        color: white;
        box-shadow: var(--shadow-md);
      }

      .btn-success:hover:not(:disabled) {
        background: #059669;
        transform: translateY(-1px);
      }

      .btn-warning {
        background: var(--warning-color);
        color: white;
        box-shadow: var(--shadow-md);
      }

      .btn-warning:hover:not(:disabled) {
        background: #d97706;
        transform: translateY(-1px);
      }

      .btn-danger {
        background: var(--danger-color);
        color: white;
        box-shadow: var(--shadow-md);
      }

      .btn-danger:hover:not(:disabled) {
        background: #dc2626;
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
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
      }

      /* Alerts */
      .alert {
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px solid transparent;
      }

      .alert-info {
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
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
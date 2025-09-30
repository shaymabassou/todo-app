import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskState } from '../../store/task.reducer';
import { selectTasks, selectTasksLoading } from '../../store/task.selectors';
import * as TaskActions from '../../store/task.actions';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="tasks-container">
      <!-- Floating Shapes -->
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>

      <!-- Header avec info utilisateur -->
      <header class="tasks-header">
        <div class="header-glow"></div>
        <div class="user-info">
          <div class="user-avatar">
            <div class="avatar-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="user-details">
            <h2>Mes Tâches</h2>
            <p>{{ currentUser }}</p>
          </div>
        </div>
        <button (click)="logout()" class="logout-btn" aria-label="Déconnexion">
          <span class="button-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m-4 9h14m-5-4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Déconnexion
          </span>
          <div class="button-shine"></div>
        </button>
      </header>

      <!-- Formulaire d'ajout/modification -->
      <app-task-form 
        [editTask]="taskToEdit" 
        (taskAdded)="onTaskAdded()" 
        (taskUpdated)="onTaskUpdated()">
      </app-task-form>

      <!-- Statistiques -->
      <div class="task-stats" *ngIf="tasks$ | async as tasks">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H3v2h6v-2zm0 4H3v2h6v-2zm0-8H3v2h6V7zm6 0H9v6h6V7z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ tasks.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ getTasksByStatus(tasks, false).length }}</span>
            <span class="stat-label">En cours</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ getTasksByStatus(tasks, true).length }}</span>
            <span class="stat-label">Complétées</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading$ | async" class="loading-container">
        <div class="spinner"></div>
        <p>Chargement des tâches...</p>
      </div>

      <!-- Liste des tâches -->
      <div class="tasks-grid" *ngIf="tasks$ | async as tasks; else noTasks">
        <div *ngFor="let task of tasks; trackBy: trackByTaskId" class="task-card" [class.completed]="task.completed">
          <div class="card-glow"></div>
          
          <!-- En-tête de la carte -->
          <div class="task-header">
            <div class="task-priority" [class]="'priority-' + task.priority">
              <span class="priority-label">{{ getPriorityLabel(task.priority) }}</span>
            </div>
            <div class="task-date" *ngIf="task.due_date">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span [class.overdue]="isOverdue(task.due_date)">
                {{ formatDate(task.due_date) }}
              </span>
            </div>
          </div>

          <!-- Contenu de la tâche -->
          <div class="task-content">
            <h3 class="task-title" [class.completed-text]="task.completed">
              {{ task.title }}
            </h3>
            <p class="task-description" *ngIf="task.description">
              {{ task.description }}
            </p>
          </div>

          <!-- Actions de la tâche -->
          <div class="task-actions">
            <button 
              (click)="toggleTask(task)" 
              class="action-btn toggle"
              [class.completed]="task.completed"
              [attr.aria-label]="task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'"
            >
              <span class="button-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ task.completed ? 'Annuler' : 'Valider' }}
              </span>
              <div class="button-shine"></div>
            </button>
            
            <button 
              (click)="editTask(task)" 
              class="action-btn edit"
              aria-label="Modifier la tâche"
            >
              <span class="button-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <div class="button-shine"></div>
            </button>
            
            <button 
              (click)="deleteTask(task.id)" 
              class="action-btn delete"
              aria-label="Supprimer la tâche"
            >
              <span class="button-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <div class="button-shine"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Message si aucune tâche -->
      <ng-template #noTasks>
        <div class="empty-state" *ngIf="!(loading$ | async)">
          <div class="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H3v2h6v-2zm0 4H3v2h6v-2zm0-8H3v2h6V7zm6 0H9v6h6V7z" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          <h3>Aucune tâche pour le moment</h3>
          <p>Commencez par ajouter votre première tâche pour organiser votre journée !</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .tasks-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      position: relative;
      overflow: hidden;
      min-height: calc(100vh - 4rem);
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

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.1); }
      50% { transform: translate(-20px, 20px) scale(0.9); }
      75% { transform: translate(20px, 30px) scale(1.05); }
    }

    /* Header */
    .tasks-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 1.5rem;
      padding: 1.5rem 2rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 
        0 10px 20px -5px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 10;
      animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .header-glow {
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

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 64px;
      height: 64px;
      position: relative;
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .avatar-inner {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 
        0 10px 20px rgba(139, 92, 246, 0.3),
        0 0 0 6px rgba(139, 92, 246, 0.1);
      position: relative;
      overflow: hidden;
    }

    .avatar-inner::before {
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
      0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }

    .user-details h2 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .user-details p {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0;
      font-weight: 500;
    }

    .logout-btn {
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #f43f5e, #e11d48);
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
        0 10px 25px rgba(244, 63, 94, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .button-content {
      display: flex;
      align-items: center;
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

    .logout-btn:hover .button-shine {
      left: 100%;
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 15px 35px rgba(244, 63, 94, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .logout-btn:active {
      transform: translateY(0);
    }

    /* Statistiques */
    .task-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 
        0 8px 20px -5px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 12px 25px -5px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .stat-icon.total { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
    .stat-icon.pending { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
    .stat-icon.completed { background: linear-gradient(135deg, #14b8a6, #10b981); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    /* Loading */
    .loading-container {
      text-align: center;
      padding: 3rem 1rem;
      color: #6b7280;
      animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #8b5cf6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Grille des tâches */
    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .task-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 
        0 10px 20px -5px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      animation: slideInUp 0.4s ease-out;
    }

    .task-card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 15px 30px -5px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .task-card.completed {
      border: 2px solid #14b8a6;
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

    /* En-tête de tâche */
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .task-priority {
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .priority-1 { background: linear-gradient(135deg, #f3f4f6, #e5e7eb); color: #6b7280; }
    .priority-2 { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1d4ed8; }
    .priority-3 { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #d97706; }
    .priority-4 { background: linear-gradient(135deg, #fed7aa, #fb923c); color: #ea580c; }
    .priority-5 { background: linear-gradient(135deg, #fecaca, #f43f5e); color: #dc2626; }

    .task-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .task-date .overdue {
      color: #dc2626;
      font-weight: 600;
    }

    /* Contenu de tâche */
    .task-content {
      margin-bottom: 1.5rem;
    }

    .task-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .task-title.completed-text {
      text-decoration: line-through;
      background: none;
      color: #6b7280;
      -webkit-text-fill-color: #6b7280;
    }

    .task-description {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.6;
    }

    /* Actions des tâches */
    .task-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .action-btn.toggle {
      background: linear-gradient(135deg, #14b8a6, #10b981);
      color: white;
      box-shadow: 
        0 4px 12px rgba(20, 184, 166, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .action-btn.toggle.completed {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      box-shadow: 
        0 4px 12px rgba(245, 158, 11, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .action-btn.toggle:hover:not(.completed) {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 20px rgba(20, 184, 166, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .action-btn.toggle.completed:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 20px rgba(245, 158, 11, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .action-btn.edit {
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: white;
      flex: 0 0 auto;
      width: 48px;
      box-shadow: 
        0 4px 12px rgba(6, 182, 212, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .action-btn.edit:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 20px rgba(6, 182, 212, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .action-btn.delete {
      background: linear-gradient(135deg, #f43f5e, #e11d48);
      color: white;
      flex: 0 0 auto;
      width: 48px;
      box-shadow: 
        0 4px 12px rgba(244, 63, 94, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    }

    .action-btn.delete:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 20px rgba(244, 63, 94, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .action-btn:hover .button-shine {
      left: 100%;
    }

    .action-btn:active {
      transform: translateY(0);
    }

    /* État vide */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
      animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .empty-icon {
      margin: 0 auto 1.5rem;
      color: #d1d5db;
    }

    .empty-state h3 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #374151;
      margin: 0 0 0.75rem 0;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .empty-state p {
      font-size: 0.9375rem;
      margin: 0;
      line-height: 1.6;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tasks-container {
        padding: 1rem;
      }

      .tasks-header {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
        padding: 1.25rem;
        border-radius: 1rem;
      }

      .user-avatar {
        width: 48px;
        height: 48px;
      }

      .user-details h2 {
        font-size: 1.75rem;
      }

      .task-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .task-card {
        padding: 1.5rem;
        border-radius: 1rem;
      }
    }

    /* Animations */
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Accessibility */
    .action-btn:focus-visible,
    .logout-btn:focus-visible {
      outline: 3px solid #8b5cf6;
      outline-offset: 3px;
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  currentUser: string | null;
  taskToEdit: Task | null = null;
  private subscription = new Subscription();

  constructor(
    private store: Store<TaskState>, 
    private taskService: TaskService,
    private router: Router
  ) {
    this.tasks$ = this.store.select(selectTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.currentUser = this.taskService.currentUser;
  }

  ngOnInit() {
    if (!this.currentUser) {
      console.log('No user logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.loadTasks();

    this.subscription.add(
      this.tasks$.subscribe(tasks => {
        console.log('Tasks in component:', tasks);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTasksByStatus(tasks: Task[], completed: boolean): Task[] {
    return tasks.filter(task => task.completed === completed);
  }

  getPriorityLabel(priority: number): string {
    const labels = ['', 'Très faible', 'Faible', 'Normal', 'Élevée', 'Critique'];
    return labels[priority] || 'Normal';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays === -1) return "Hier";
    if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jour(s)`;
    if (diffDays <= 7) return `Dans ${diffDays} jour(s)`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  }

  isOverdue(dateString: string): boolean {
    return new Date(dateString) < new Date();
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  toggleTask(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };
    this.store.dispatch(TaskActions.updateTask({ task: updatedTask }));
  }

  deleteTask(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }

  editTask(task: Task) {
    this.taskToEdit = { ...task };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.taskService.clearUser();
    this.store.dispatch(TaskActions.logout());
    this.router.navigate(['/login']);
  }

  loadTasks() {
    this.store.dispatch(TaskActions.loadTasks());
  }

  onTaskAdded() {
    this.taskToEdit = null;
    setTimeout(() => {
      this.loadTasks();
    }, 200);
  }

  onTaskUpdated() {
    this.taskToEdit = null;
    setTimeout(() => {
      this.loadTasks();
    }, 200);
  }
}
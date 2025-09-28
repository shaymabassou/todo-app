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
      <!-- Header avec info utilisateur -->
      <header class="tasks-header">
        <div class="user-info">
          <div class="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="user-details">
            <h2>Mes Tâches</h2>
            <p>{{ currentUser }}</p>
          </div>
        </div>
        <button (click)="logout()" class="logout-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m-4 9h14m-5-4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Déconnexion
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div *ngFor="let task of tasks; trackBy: trackByTaskId" 
             class="task-card" 
             [class.completed]="task.completed">
          
          <!-- En-tête de la carte -->
          <div class="task-header">
            <div class="task-priority" [class]="'priority-' + task.priority">
              <span class="priority-label">{{ getPriorityLabel(task.priority) }}</span>
            </div>
            <div class="task-date" *ngIf="task.due_date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ task.completed ? 'Annuler' : 'Valider' }}
            </button>
            
            <button 
              (click)="editTask(task)" 
              class="action-btn edit"
              aria-label="Modifier la tâche"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <button 
              (click)="deleteTask(task.id)" 
              class="action-btn delete"
              aria-label="Supprimer la tâche"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Message si aucune tâche -->
      <ng-template #noTasks>
        <div class="empty-state" *ngIf="!(loading$ | async)">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      max-width: 1000px;
      margin: 0 auto;
      padding: 1rem;
    }

    /* Header */
    .tasks-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(229, 231, 235, 0.8);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
    }

    .user-details h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .user-details p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #6b7280;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #ef4444;
      color: white;
    }

    /* Statistiques */
    .task-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(229, 231, 235, 0.8);
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.total { background: linear-gradient(135deg, #6366f1, #818cf8); }
    .stat-icon.pending { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
    .stat-icon.completed { background: linear-gradient(135deg, #10b981, #34d399); }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Loading */
    .loading-container {
      text-align: center;
      padding: 3rem 1rem;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #6366f1;
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
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .task-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(229, 231, 235, 0.8);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .task-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    }

    .task-card.completed {
      background: #f9fafb;
      border-color: #10b981;
    }

    .task-card.completed::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    .task-card:not(.completed)::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #818cf8);
    }

    /* En-tête de tâche */
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .task-priority {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .priority-1 { background: #f3f4f6; color: #6b7280; }
    .priority-2 { background: #dbeafe; color: #1d4ed8; }
    .priority-3 { background: #fef3c7; color: #d97706; }
    .priority-4 { background: #fed7aa; color: #ea580c; }
    .priority-5 { background: #fecaca; color: #dc2626; }

    .task-date {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
    }

    .task-date .overdue {
      color: #dc2626;
      font-weight: 500;
    }

    /* Contenu de tâche */
    .task-content {
      margin-bottom: 1.5rem;
    }

    .task-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .task-title.completed-text {
      text-decoration: line-through;
      color: #6b7280;
    }

    .task-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    /* Actions des tâches */
    .task-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .action-btn.toggle {
      background: #f0fdf4;
      color: #16a34a;
      border: 1px solid #bbf7d0;
    }

    .action-btn.toggle.completed {
      background: #fef3c7;
      color: #d97706;
      border-color: #fde68a;
    }

    .action-btn.toggle:hover {
      background: #16a34a;
      color: white;
    }

    .action-btn.toggle.completed:hover {
      background: #d97706;
      color: white;
    }

    .action-btn.edit {
      background: #f0f9ff;
      color: #0369a1;
      border: 1px solid #bae6fd;
      flex: 0 0 auto;
      width: 40px;
    }

    .action-btn.edit:hover {
      background: #0369a1;
      color: white;
    }

    .action-btn.delete {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      flex: 0 0 auto;
      width: 40px;
    }

    .action-btn.delete:hover {
      background: #dc2626;
      color: white;
    }

    /* État vide */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-icon {
      margin: 0 auto 1.5rem;
      color: #d1d5db;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      margin: 0;
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tasks-container {
        padding: 0.5rem;
      }

      .tasks-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .task-stats {
        grid-template-columns: 1fr;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .task-card {
        padding: 1.25rem;
      }

      .user-details h2 {
        font-size: 1.25rem;
      }
    }

    /* Animations */
    .task-card {
      animation: slideInUp 0.3s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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

  // Méthodes utilitaires
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

  // Actions
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
  }}
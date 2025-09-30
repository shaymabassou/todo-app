import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { TaskState } from '../../store/task.reducer';
import * as TaskActions from '../../store/task.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="task-form-container">
      <!-- Floating Shapes -->
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>

      <div class="task-form-card">
        <!-- Glow Effect -->
        <div class="card-glow"></div>

        <div class="form-header">
          <div class="form-icon">
            <div class="icon-inner">
              <svg *ngIf="!editTask" width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg *ngIf="editTask" width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="form-title">
            <h3>{{ editTask ? 'Modifier la tâche' : 'Nouvelle tâche' }}</h3>
            <p>{{ editTask ? 'Modifiez les détails de votre tâche' : 'Ajoutez une nouvelle tâche à votre liste' }}</p>
          </div>
          <button 
            *ngIf="editTask" 
            (click)="cancelEdit()" 
            class="cancel-btn"
            type="button"
            aria-label="Annuler la modification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="title" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18v-6a9 9 0 0118 0v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Titre *
              </label>
              <div class="input-wrapper">
                <input
                  id="title"
                  formControlName="title"
                  type="text"
                  class="form-input"
                  placeholder="Ex: Faire les courses"
                  [class.input-error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
                  [class.input-success]="taskForm.get('title')?.valid && taskForm.get('title')?.touched"
                />
                <div class="input-icon" *ngIf="taskForm.get('title')?.valid && taskForm.get('title')?.touched">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Le titre est requis
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 18v-6a9 9 0 0118 0v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Description
              </label>
              <textarea
                id="description"
                formControlName="description"
                class="form-input"
                placeholder="Décrivez votre tâche..."
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="priority" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6v6h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Priorité
              </label>
              <select
                id="priority"
                formControlName="priority"
                class="form-input"
                [class.input-error]="taskForm.get('priority')?.invalid && taskForm.get('priority')?.touched"
                [class.input-success]="taskForm.get('priority')?.valid && taskForm.get('priority')?.touched"
              >
                <option value="1">1 - Très faible</option>
                <option value="2">2 - Faible</option>
                <option value="3">3 - Normal</option>
                <option value="4">4 - Élevée</option>
                <option value="5">5 - Critique</option>
              </select>
            </div>

            <div class="form-group">
              <label for="due_date" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Échéance
              </label>
              <input
                id="due_date"
                formControlName="due_date"
                type="date"
                class="form-input"
                [class.input-success]="taskForm.get('due_date')?.value"
              />
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            [disabled]="taskForm.invalid"
            [class.update]="editTask"
          >
            <span class="button-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path *ngIf="!editTask" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path *ngIf="editTask" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ editTask ? 'Mettre à jour' : 'Ajouter la tâche' }}
            </span>
            <div class="button-shine"></div>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .task-form-container {
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

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.1); }
      50% { transform: translate(-20px, 20px) scale(0.9); }
      75% { transform: translate(20px, 30px) scale(1.05); }
    }

    /* Task Form Card */
    .task-form-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 2rem;
      padding: 3rem 2.5rem;
      width: 100%;
      max-width: 560px;
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
      from { opacity: 0; transform: translateY(50px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Form Header */
    .form-header {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      position: relative;
      z-index: 1;
    }

    .form-icon {
      width: 100px;
      height: 100px;
      margin: 0 0 1.5rem 0;
      position: relative;
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .icon-inner {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
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
      0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }

    .form-title h3 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .form-title p {
      color: #6b7280;
      font-size: 0.9375rem;
      margin: 0;
      line-height: 1.6;
      font-weight: 500;
    }

    .cancel-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 0.75rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8b5cf6;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .cancel-btn:hover {
      background: #8b5cf6;
      color: white;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    /* Form */
    .task-form {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      position: relative;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
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

    select.form-input {
      cursor: pointer;
      padding-right: 2rem;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
    }

    textarea.form-input {
      resize: vertical;
      min-height: 100px;
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
      0% { opacity: 0; transform: translateY(-50%) scale(0); }
      50% { transform: translateY(-50%) scale(1.2); }
      100% { opacity: 1; transform: translateY(-50%) scale(1); }
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
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Submit Button */
    .submit-btn {
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

    .submit-btn.update {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      box-shadow: 
        0 10px 25px rgba(245, 158, 11, 0.3),
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

    .submit-btn:hover:not(:disabled) .button-shine {
      left: 100%;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 
        0 15px 35px rgba(139, 92, 246, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .submit-btn.update:hover:not(:disabled) {
      box-shadow: 
        0 15px 35px rgba(245, 158, 11, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }

    .submit-btn:focus-visible {
      outline: 3px solid #8b5cf6;
      outline-offset: 3px;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .task-form-container {
        padding: 1rem;
      }

      .task-form-card {
        padding: 2rem 1.5rem;
        border-radius: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-icon {
        width: 80px;
        height: 80px;
      }

      .form-title h3 {
        font-size: 1.75rem;
      }

      .form-title p {
        font-size: 0.875rem;
      }
    }

    /* Accessibility */
    .form-input:focus-visible {
      outline: none;
    }
  `]
})
export class TaskFormComponent implements OnChanges {
  @Input() editTask: Task | null = null;
  @Output() taskAdded = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<Task>();
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService, private store: Store<TaskState>) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      due_date: [''],
    });
  }

  ngOnChanges() {
    if (this.editTask) {
      this.taskForm.patchValue({
        title: this.editTask.title,
        description: this.editTask.description || '',
        priority: this.editTask.priority,
        due_date: this.editTask.due_date || '',
      });
    } else {
      this.taskForm.reset({ priority: 3 });
    }
  }

  onSubmit() {
    if (this.taskForm.valid && this.taskService.currentUser) {
      const taskData = this.taskForm.value;
      const task: Task = {
        ...taskData,
        id: this.editTask?.id || Date.now(),
        completed: this.editTask?.completed || false,
        user: this.taskService.currentUser,//<-- email ajoute dans ceci 
      };
      
      if (this.editTask) {
        this.store.dispatch(TaskActions.updateTask({ task }));
        this.taskUpdated.emit(task);
      } else {
        this.store.dispatch(TaskActions.addTask({ task }));
        this.taskAdded.emit();
      }
      
      setTimeout(() => {
        this.resetForm();
      }, 100);
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

  cancelEdit() {
    this.resetForm();
    this.taskUpdated.emit();
  }

  private resetForm() {
    this.taskForm.reset({ priority: 3 });
    this.editTask = null;
  }
}
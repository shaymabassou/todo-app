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
      <div class="task-form-card">
        <div class="form-header">
          <div class="form-icon">
            <svg *ngIf="!editTask" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg *ngIf="editTask" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="title">Titre *</label>
              <input
                id="title"
                formControlName="title"
                type="text"
                class="form-input"
                placeholder="Ex: Faire les courses"
                [class.error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
              />
              <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="error-message">
                Le titre est requis
              </div>
            </div>

            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-input"
                placeholder="Décrivez votre tâche..."
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="priority">Priorité</label>
              <select
                id="priority"
                formControlName="priority"
                class="form-input"
                [class.error]="taskForm.get('priority')?.invalid && taskForm.get('priority')?.touched"
              >
                <option value="1">1 - Très faible</option>
                <option value="2">2 - Faible</option>
                <option value="3">3 - Normal</option>
                <option value="4">4 - Élevée</option>
                <option value="5">5 - Critique</option>
              </select>
            </div>

            <div class="form-group">
              <label for="due_date">Échéance</label>
              <input
                id="due_date"
                formControlName="due_date"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            class="submit-btn"
            [disabled]="taskForm.invalid"
            [class.update]="editTask"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path *ngIf="!editTask" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path *ngIf="editTask" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ editTask ? 'Mettre à jour' : 'Ajouter la tâche' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .task-form-container {
      max-width: 500px;
      margin: 0 auto 2rem;
      padding: 0 1rem;
    }

    .task-form-card {
      background: white;
      border-radius: 1.25rem;
      padding: 1.5rem;
      box-shadow: 
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(229, 231, 235, 0.8);
      position: relative;
    }

    .task-form-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #818cf8);
      border-radius: 1.25rem 1.25rem 0 0;
    }

    .form-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
      position: relative;
    }

    .form-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
    }

    .form-title {
      flex: 1;
    }

    .form-title h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      line-height: 1.3;
    }

    .form-title p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.4;
    }

    .cancel-btn {
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .cancel-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .task-form {
      position: relative;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      position: relative;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
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
      padding: 0.75rem;
      font-size: 0.875rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      transition: all 0.2s ease;
      background: #f9fafb;
      outline: none;
    }

    .form-input:focus {
      border-color: #6366f1;
      background: white;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    select.form-input {
      cursor: pointer;
    }

    textarea.form-input {
      resize: vertical;
      min-height: 80px;
    }

    .error-message {
      position: absolute;
      top: 100%;
      left: 0;
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.25rem;
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
    }

    .submit-btn.update {
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      box-shadow: 0 4px 6px rgba(245, 158, 11, 0.2);
    }

    .submit-btn.update:hover:not(:disabled) {
      box-shadow: 0 6px 12px rgba(245, 158, 11, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    /* Animation */
    .task-form-card {
      animation: slideInUp 0.4s ease-out;
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

    /* Responsive */
    @media (max-width: 640px) {
      .task-form-container {
        padding: 0 0.5rem;
      }
      
      .task-form-card {
        padding: 1.25rem;
        border-radius: 1rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-header {
        gap: 0.75rem;
      }
      
      .form-icon {
        width: 40px;
        height: 40px;
      }
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
        user: this.taskService.currentUser,
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

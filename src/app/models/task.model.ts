//structure de tache 

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: number;
  due_date?: string;
  completed: boolean;
  user?: string | null; 
}
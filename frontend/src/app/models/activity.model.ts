// modela datos de actividad en el frontend según el backend

export interface Activity {
  id?: number;
  title: string;
  description?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActivityDto {
  title: string;
  description?: string;
  date: string;
}

export interface UpdateActivityDto {
  title?: string;
  description?: string;
  date?: string;
}

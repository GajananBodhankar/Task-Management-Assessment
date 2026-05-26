export type TaskStatus = 'pending' | 'completed'
export type Priority = 'low' | 'medium' | 'high'

export type User = {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export type Task = {
  _id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type TaskPayload = {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  dueDate: string | null
}

export type Pagination = {
  page: number
  limit: number
  total: number
  pages: number
}

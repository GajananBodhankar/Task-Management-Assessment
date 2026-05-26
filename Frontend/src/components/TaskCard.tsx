import { CalendarDays, Check, Pencil, Trash2 } from 'lucide-react'
import type { Task } from '../types'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggle: (task: Task) => void
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const TaskCard = ({ task, onEdit, onDelete, onToggle }: TaskCardProps) => {
  const isCompleted = task.status === 'completed'

  return (
    <article className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-header">
        <button
          className={`status-toggle ${isCompleted ? 'done' : ''}`}
          onClick={() => onToggle(task)}
          title={isCompleted ? 'Mark pending' : 'Mark completed'}
          type="button"
        >
          {isCompleted && <Check size={16} />}
        </button>
        <div>
          <h3>{task.title}</h3>
          <span className={`priority ${task.priority}`}>{task.priority}</span>
        </div>
      </div>

      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span className={isCompleted ? 'complete-label' : ''}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>
        {task.dueDate && (
          <span>
            <CalendarDays size={15} />
            {dateFormatter.format(new Date(task.dueDate))}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} title="Edit task" type="button">
          <Pencil size={17} />
        </button>
        <button onClick={() => onDelete(task._id)} title="Delete task" type="button">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  )
}

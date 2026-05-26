import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Priority, Task, TaskPayload, TaskStatus } from '../types'

type TaskFormProps = {
  editingTask: Task | null
  onCancelEdit: () => void
  onSubmit: (payload: TaskPayload, taskId?: string) => Promise<void>
}

const initialForm: TaskPayload = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: null,
}

const toInputDate = (date: string | null) => (date ? date.slice(0, 10) : '')

export const TaskForm = ({ editingTask, onCancelEdit, onSubmit }: TaskFormProps) => {
  const [form, setForm] = useState<TaskPayload>(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: toInputDate(editingTask.dueDate),
      })
    } else {
      setForm(initialForm)
    }
    setError('')
  }, [editingTask])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (form.title.trim().length < 2) {
      setError('Title must be at least 2 characters.')
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(
        {
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        },
        editingTask?._id,
      )
      setForm(initialForm)
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : 'Could not save task.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-header">
        <h2>{editingTask ? 'Edit task' : 'Create task'}</h2>
        {editingTask && (
          <button className="ghost-button" onClick={onCancelEdit} type="button">
            Cancel
          </button>
        )}
      </div>

      <label>
        Title
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Design review"
        />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Add context, blockers, or acceptance criteria"
          rows={4}
        />
      </label>

      <div className="form-grid">
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))
            }
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={form.priority}
            onChange={(event) =>
              setForm((current) => ({ ...current, priority: event.target.value as Priority }))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label>
        Due date
        <input
          value={form.dueDate ?? ''}
          onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
          type="date"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="primary-button" disabled={submitting} type="submit">
        {submitting ? 'Saving...' : editingTask ? 'Update task' : 'Add task'}
      </button>
    </form>
  )
}

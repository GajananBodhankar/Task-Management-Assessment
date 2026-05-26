import { LogOut, Moon, Search, Sun } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { taskApi } from '../services/api'
import type { Pagination, Task, TaskPayload, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'

type Filter = TaskStatus | 'all'

const defaultPagination: Pagination = {
  page: 1,
  limit: 8,
  total: 0,
  pages: 1,
}

export const Dashboard = () => {
  const { logout, token, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [status, setStatus] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(defaultPagination)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('taskflow_theme') === 'dark')

  const loadTasks = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      setError('')
      const response = await taskApi.list(token, { status, search, page })
      setTasks(response.data)
      setPagination(response.pagination)
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : 'Could not load tasks.')
    } finally {
      setLoading(false)
    }
  }, [page, search, status, token])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    localStorage.setItem('taskflow_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const counts = useMemo(
    () => ({
      total: pagination.total,
      completed: tasks.filter((task) => task.status === 'completed').length,
      pending: tasks.filter((task) => task.status === 'pending').length,
    }),
    [pagination.total, tasks],
  )

  const saveTask = async (payload: TaskPayload, taskId?: string) => {
    if (!token) return

    if (taskId) {
      await taskApi.update(token, taskId, payload)
      setEditingTask(null)
    } else {
      await taskApi.create(token, payload)
    }

    await loadTasks()
  }

  const toggleTask = async (task: Task) => {
    if (!token) return
    await taskApi.update(token, task._id, {
      status: task.status === 'completed' ? 'pending' : 'completed',
    })
    await loadTasks()
  }

  const deleteTask = async (id: string) => {
    if (!token) return
    const confirmed = window.confirm('Delete this task?')
    if (!confirmed) return

    await taskApi.remove(token, id)
    if (editingTask?._id === id) setEditingTask(null)
    await loadTasks()
  }

  const updateFilter = (nextStatus: Filter) => {
    setStatus(nextStatus)
    setPage(1)
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <span className="eyebrow">TaskFlow</span>
          <h1>Welcome back, {user?.name.split(' ')[0]}</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="icon-button"
            onClick={() => setDarkMode((current) => !current)}
            title={darkMode ? 'Use light mode' : 'Use dark mode'}
            type="button"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button className="logout-button" onClick={logout} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <section className="stats-grid" aria-label="Task summary">
        <div>
          <span>{counts.total}</span>
          Total tasks
        </div>
        <div>
          <span>{counts.pending}</span>
          Pending on page
        </div>
        <div>
          <span>{counts.completed}</span>
          Completed on page
        </div>
      </section>

      <section className="workspace">
        <TaskForm editingTask={editingTask} onCancelEdit={() => setEditingTask(null)} onSubmit={saveTask} />

        <section className="task-section">
          <div className="task-toolbar">
            <div className="search-field">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search tasks"
              />
            </div>

            <div className="filter-tabs" role="tablist" aria-label="Task filters">
              {(['all', 'pending', 'completed'] as Filter[]).map((item) => (
                <button
                  className={status === item ? 'active' : ''}
                  key={item}
                  onClick={() => updateFilter(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="task-list">
            {loading ? (
              <div className="empty-state">Loading tasks...</div>
            ) : tasks.length ? (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={deleteTask}
                  onEdit={setEditingTask}
                  onToggle={toggleTask}
                />
              ))
            ) : (
              <div className="empty-state">No tasks found.</div>
            )}
          </div>

          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} type="button">
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

import { useState, useCallback } from 'react'
import { css } from '@emotion/react'
import Calendar from './components/Calendar.tsx'
import SearchBar from './components/SearchBar.tsx'
import { Task } from './types.ts'

const appStyles = css`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`

const contentStyles = css`
  max-width: 1400px;
  margin: 0 auto;
`

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleTaskCreate = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }, [])

  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [])

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div css={appStyles}>
      <div css={contentStyles}>
        
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        <Calendar
          tasks={filteredTasks}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  )
}

export default App 
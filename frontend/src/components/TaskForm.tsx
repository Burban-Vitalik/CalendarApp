/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/react'

const formStyles = css`
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 0.25rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`

const inputStyles = css`
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`

const buttonGroupStyles = css`
  display: flex;
  gap: 0.25rem;
  justify-content: flex-end;
`

const buttonStyles = css`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  cursor: pointer;
  border: none;
  
  &.primary {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`

interface TaskFormProps {
  onSubmit: (task: { title: string; description?: string }) => void
  onCancel: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <form css={formStyles} onSubmit={handleSubmit}>
      <input
        ref={titleInputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        css={inputStyles}
        placeholder="Task title..."
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        css={inputStyles}
        placeholder="Description (optional)..."
      />
      <div css={buttonGroupStyles}>
        <button
          type="submit"
          disabled={!title.trim()}
          css={[buttonStyles, css`&.primary { background: #3b82f6; color: white; }`]}
          className="primary"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          css={[buttonStyles, css`&.secondary { background: #f3f4f6; color: #374151; }`]}
          className="secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskForm 
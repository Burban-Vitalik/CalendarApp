/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/react'
import { Task } from '../types'

const taskStyles = css`
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.5rem;
  cursor: grab;
  font-size: 0.75rem;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
  }
  
  &.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
  
  &.completed {
    opacity: 0.6;
    text-decoration: line-through;
  }
`

const taskContentStyles = css`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`

const checkboxStyles = css`
  margin: 0;
  cursor: pointer;
  accent-color: #3b82f6;
`

const taskTextStyles = css`
  flex: 1;
  line-height: 1.3;
  word-break: break-word;
`

const titleStyles = css`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`

const descriptionStyles = css`
  color: #6b7280;
  font-size: 0.65rem;
`

const actionsStyles = css`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  gap: 0.25rem;
  
  .task-item:hover & {
    opacity: 1;
  }
`

const actionButtonStyles = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.125rem;
  color: #6b7280;
  font-size: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
  
  &.delete:hover {
    color: #dc2626;
    background: #fef2f2;
  }
`

const editFormStyles = css`
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 0.25rem;
  padding: 0.75rem;
  margin-top: 0.75rem;
`

const inputStyles = css`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  
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
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`

interface TaskItemProps {
  task: Task
  index: number
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onReorder: (taskId: string, updates: Partial<Task>) => void
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onUpdate,
  onDelete,
  onReorder
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    const dragData = {
      type: 'task',
      taskId: task.id,
      sourceDate: task.date,
      sourceIndex: index,
      currentOrder: task.order
    }
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed })
  }

  const handleSaveEdit = () => {
    onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  if (isEditing) {
    return (
      <div css={editFormStyles}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          css={inputStyles}
          placeholder="Task title..."
          autoFocus
        />
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          css={inputStyles}
          placeholder="Description (optional)..."
        />
        <div css={buttonGroupStyles}>
          <button
            onClick={handleSaveEdit}
            css={[buttonStyles, css`&.primary { background: #3b82f6; color: white; }`]}
            className="primary"
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            css={[buttonStyles, css`&.secondary { background: #f3f4f6; color: #374151; }`]}
            className="secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`task-item ${isDragging ? 'dragging' : ''} ${task.completed ? 'completed' : ''}`}
      css={taskStyles}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div css={taskContentStyles}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          css={checkboxStyles}
        />
        <div css={taskTextStyles}>
          <div css={titleStyles}>{task.title}</div>
          {task.description && (
            <div css={descriptionStyles}>{task.description}</div>
          )}
        </div>
      </div>
      
      <div css={actionsStyles}>
        <button
          onClick={() => setIsEditing(true)}
          css={[actionButtonStyles, css`&.edit:hover { color:rgb(255, 255, 255); background:#3b82f6; }`]}
          className="edit"
          title="Edit task" 
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(task.id)}
          css={[actionButtonStyles, css`&.delete:hover { color: #dc2626; background: #fef2f2; }`]}
          className="delete"
          title="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default TaskItem
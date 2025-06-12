/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react'
import { css } from '@emotion/react'
import TaskItem from './TaskItem.tsx'
import TaskForm from './TaskForm.tsx'
import { Task, CalendarDay as CalendarDayType } from '../types.ts'

const dayStyles = css`
  background: white;
  min-height: 120px;
  padding: 0.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
  
  &.drag-over {
    background: #dbeafe;
    border-color: #3b82f6;
  }
`

const dayNumberStyles = css`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-weight: 600;
  color: #374151;
  z-index: 1;
  
  &.other-month {
    color: #9ca3af;
  }
  
  &.today {
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }
`

const holidayStyles = css`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  margin: 1.5rem 0 0.25rem 0;
  font-size: 0.7rem;
  color: #92400e;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &[data-type="international"] {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #1e40af;
  }
  
  &[data-type="religious"] {
    background: #f3e8ff;
    border-color: #9333ea;
    color: #6b21a8;
  }
  
  &[data-type="observance"] {
    background: #dcfce7;
    border-color: #22c55e;
    color: #166534;
  }
`

const tasksContainerStyles = css`
  flex: 1;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  max-height: 200px;
`

const addButtonStyles = css`
  margin-top: 0.5rem;
  padding: 0.25rem;
  background: transparent;
  border: 1px dashed #d1d5db;
  border-radius: 0.25rem;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  .calendar-day:hover & {
    opacity: 1;
  }
`

interface CalendarDayProps {
  day: CalendarDayType
  onTaskCreate: (task: Omit<Task, 'id'>) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskDelete: (taskId: string) => void
  onTaskMove: (taskId: string, newDate: string, newOrder: number) => void
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const tasksContainerRef = useRef<HTMLDivElement>(null)
  
  const dayNumber = new Date(day.date).getDate()
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.target === tasksContainerRef.current || !tasksContainerRef.current?.contains(e.target as Node)) {
      setDragOver(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (dragData.type === 'task' && dragData.taskId) {
        const dropTarget = (e.target as HTMLElement).closest('.task-item')
        const container = tasksContainerRef.current
        
        if (dragData.sourceDate === day.date) {
          let newOrder: number
          
          if (!dropTarget || !container) {
            newOrder = day.tasks.length
          } else {
            const dropTaskIndex = Array.from(container.children).indexOf(dropTarget)
            const dropTask = day.tasks[dropTaskIndex]
            
            if (dragData.sourceIndex < dropTaskIndex) {
              newOrder = dropTask.order
            } else {
              newOrder = dropTask.order
            }
          }
          
          const tasksToUpdate = day.tasks.filter(t => {
            if (t.id === dragData.taskId) return false
            if (dragData.currentOrder < newOrder) {
              return t.order > dragData.currentOrder && t.order <= newOrder
            } else {
              return t.order >= newOrder && t.order < dragData.currentOrder
            }
          })
          
          tasksToUpdate.forEach(t => {
            if (dragData.currentOrder < newOrder) {
              onTaskUpdate(t.id, { order: t.order - 1 })
            } else {
              onTaskUpdate(t.id, { order: t.order + 1 })
            }
          })
          
          onTaskUpdate(dragData.taskId, { order: newOrder })
        } else {
          const newOrder = day.tasks.length
          onTaskMove(dragData.taskId, day.date, newOrder)
        }
      }
    } catch (error) {
      console.error('Invalid drag data:', error)
    }
  }
  
  const handleTaskCreate = (taskData: { title: string; description?: string }) => {
    onTaskCreate({
      ...taskData,
      date: day.date,
      completed: false,
      order: day.tasks.length
    })
    setShowTaskForm(false)
  }
  
  return (
    <div
      className={`calendar-day ${dragOver ? 'drag-over' : ''}`}
      css={dayStyles}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        css={dayNumberStyles}
        className={`${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
      >
        {dayNumber}
      </div>
      
      {day.holidays.map(holiday => (
        <div 
          key={holiday.name} 
          css={holidayStyles}
          data-type={holiday.type}
          title={holiday.name}
        >
          {holiday.name}
        </div>
      ))}
      
      <div 
        ref={tasksContainerRef}
        css={tasksContainerStyles}
      >
        {day.tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
            onReorder={onTaskUpdate}
          />
        ))}
      </div>
      
      {showTaskForm ? (
        <TaskForm
          onSubmit={handleTaskCreate}
          onCancel={() => setShowTaskForm(false)}
        />
      ) : (
        <button
          css={addButtonStyles}
          onClick={() => setShowTaskForm(true)}
        >
          + Add task
        </button>
      )}
    </div>
  )
}

export default CalendarDay 
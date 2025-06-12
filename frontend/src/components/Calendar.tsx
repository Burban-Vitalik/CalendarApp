/** @jsxImportSource @emotion/react */
import React, { useState, useMemo } from 'react'
import { css } from '@emotion/react'
import CalendarDay from './CalendarDay.tsx'
import { Task, CalendarDay as CalendarDayType } from '../types.ts'
import { getMonthData, formatMonthYear, toISODate, getTodayISO } from '../utils/dateUtils.ts'
import { getHolidaysForMonth } from '../utils/holidayUtils.ts'

const calendarStyles = css`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #3b82f6;
  color: white;
`

const navButtonStyles = css`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const monthTitleStyles = css`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const weekdaysStyles = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`

const weekdayStyles = css`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const gridStyles = css`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
`

interface CalendarProps {
  tasks: Task[]
  onTaskCreate: (task: Omit<Task, 'id'>) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskDelete: (taskId: string) => void
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar: React.FC<CalendarProps> = ({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarData = useMemo(() => {
    const monthData = getMonthData(currentDate)
    const holidays = getHolidaysForMonth(currentDate)
    
    return monthData.map(date => {
      const dateStr = toISODate(date)
      const dayTasks = tasks
        .filter(task => task.date === dateStr)
        .sort((a, b) => a.order - b.order)
      const dayHolidays = holidays.filter(holiday => holiday.date === dateStr)
      
      return {
        date: dateStr,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: dateStr === getTodayISO(),
        tasks: dayTasks,
        holidays: dayHolidays
      } as CalendarDayType
    })
  }, [currentDate, tasks])

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleTaskMove = (taskId: string, newDate: string, newOrder: number) => {
    onTaskUpdate(taskId, { date: newDate, order: newOrder })
  }

  return (
    <div css={calendarStyles}>
      <header css={headerStyles}>
        <button css={navButtonStyles} onClick={handlePrevMonth}>
          ← Previous
        </button>
        <h2 css={monthTitleStyles}>
          {formatMonthYear(currentDate)}
        </h2>
        <button css={navButtonStyles} onClick={handleNextMonth}>
          Next →
        </button>
      </header>
      
      <div css={weekdaysStyles}>
        {weekdays.map(day => (
          <div key={day} css={weekdayStyles}>
            {day}
          </div>
        ))}
      </div>
      
      <div css={gridStyles}>
        {calendarData.map(day => (
          <CalendarDay
            key={day.date}
            day={day}
            onTaskCreate={onTaskCreate}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
            onTaskMove={handleTaskMove}
          />
        ))}
      </div>
    </div>
  )
}

export default Calendar 
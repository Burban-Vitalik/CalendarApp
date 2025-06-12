export type HolidayType = 'national' | 'international' | 'religious' | 'observance'

export interface Task {
  id: string
  title: string
  description?: string
  date: string // ISO date string (YYYY-MM-DD)
  completed: boolean
  order: number // for ordering within a day
}

export interface Holiday {
  name: string
  date: string // ISO date string (YYYY-MM-DD)
  type: HolidayType
}

export interface CalendarDay {
  date: string // ISO date string (YYYY-MM-DD)
  isCurrentMonth: boolean
  isToday: boolean
  tasks: Task[]
  holidays: Holiday[]
}

export interface DragItem {
  type: 'task'
  taskId: string
  sourceDate: string
  sourceIndex: number
} 
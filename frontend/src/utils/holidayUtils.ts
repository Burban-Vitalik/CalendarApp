import { Holiday, HolidayType } from '../types'

function getNthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const date = new Date(year, month, 1)
  let count = 0
  
  while (date.getDay() !== weekday) {
    date.setDate(date.getDate() + 1)
  }
  
  date.setDate(date.getDate() + (n - 1) * 7)
  return date
}

function getLastWeekday(year: number, month: number, weekday: number): Date {
  const date = new Date(year, month + 1, 0)
  while (date.getDay() !== weekday) {
    date.setDate(date.getDate() - 1)
  }
  return date
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function generateHolidaysForYear(year: number): Holiday[] {
  const holidays: Holiday[] = []

  const fixedHolidays = [
    { name: "New Year's Day", date: `${year}-01-01`, type: "national" as HolidayType },
    { name: "Valentine's Day", date: `${year}-02-14`, type: "observance" as HolidayType },
    { name: "St. Patrick's Day", date: `${year}-03-17`, type: "observance" as HolidayType },
    { name: "Earth Day", date: `${year}-04-22`, type: "international" as HolidayType },
    { name: "Independence Day", date: `${year}-07-04`, type: "national" as HolidayType },
    { name: "International Day of Peace", date: `${year}-09-21`, type: "international" as HolidayType },
    { name: "Halloween", date: `${year}-10-31`, type: "observance" as HolidayType },
    { name: "Veterans Day", date: `${year}-11-11`, type: "national" as HolidayType },
    { name: "Christmas Eve", date: `${year}-12-24`, type: "observance" as HolidayType },
    { name: "Christmas Day", date: `${year}-12-25`, type: "national" as HolidayType },
    { name: "New Year's Eve", date: `${year}-12-31`, type: "observance" as HolidayType },
  ]
  holidays.push(...fixedHolidays)

  holidays.push({
    name: "Martin Luther King Jr. Day",
    date: formatDate(getNthWeekday(year, 0, 1, 3)),
    type: "national"
  })

  holidays.push({
    name: "Presidents Day",
    date: formatDate(getNthWeekday(year, 1, 1, 3)),
    type: "national"
  })

  holidays.push({
    name: "Mother's Day",
    date: formatDate(getNthWeekday(year, 4, 0, 2)),
    type: "observance"
  })

  holidays.push({
    name: "Memorial Day",
    date: formatDate(getLastWeekday(year, 4, 1)),
    type: "national"
  })

  holidays.push({
    name: "Father's Day",
    date: formatDate(getNthWeekday(year, 5, 0, 3)),
    type: "observance"
  })

  holidays.push({
    name: "Labor Day",
    date: formatDate(getNthWeekday(year, 8, 1, 1)),
    type: "national"
  })
  holidays.push({
    name: "Columbus Day",
    date: formatDate(getNthWeekday(year, 9, 1, 2)),
    type: "national"
  })

  holidays.push({
    name: "Thanksgiving",
    date: formatDate(getNthWeekday(year, 10, 4, 4)),
    type: "national"
  })

  const lunarHolidays = calculateLunarHolidays(year)
  holidays.push(...lunarHolidays)

  return holidays
}

function calculateLunarHolidays(year: number): Holiday[] {
  const springOffset = Math.floor((year - 2000) * 0.2) % 30
  const autumnOffset = Math.floor((year - 2000) * 0.3) % 30
  
  return [
    {
      name: "Lunar New Year",
      date: `${year}-${String(1 + Math.floor(springOffset / 30)).padStart(2, '0')}-${String(20 + (springOffset % 30)).padStart(2, '0')}`,
      type: "international"
    },
    {
      name: "Mid-Autumn Festival",
      date: `${year}-${String(8 + Math.floor(autumnOffset / 30)).padStart(2, '0')}-${String(10 + (autumnOffset % 30)).padStart(2, '0')}`,
      type: "international"
    }
  ]
}

const holidayCache = new Map<number, Holiday[]>()


export function getHolidaysForMonth(date: Date): Holiday[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  if (!holidayCache.has(year)) {
    holidayCache.set(year, generateHolidaysForYear(year))
  }
  
  const yearHolidays = holidayCache.get(year)!
  return yearHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date)
    return holidayDate.getMonth() === month
  })
}

export function getHolidaysForDate(dateString: string): Holiday[] {
  const date = new Date(dateString)
  const year = date.getFullYear()
  
  if (!holidayCache.has(year)) {
    holidayCache.set(year, generateHolidaysForYear(year))
  }
  
  const yearHolidays = holidayCache.get(year)!
  return yearHolidays.filter(holiday => holiday.date === dateString)
}

export function isHoliday(dateString: string): boolean {
  return getHolidaysForDate(dateString).length > 0
}

export function getHolidaysForYear(year: number): Holiday[] {
  if (!holidayCache.has(year)) {
    holidayCache.set(year, generateHolidaysForYear(year))
  }
  return holidayCache.get(year)!
} 
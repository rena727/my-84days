import { INITIAL_STATE } from '../data/defaultState'

const STORAGE_KEY = 'SPRINT_84_USER_DATA_V1'

export const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...INITIAL_STATE, ...parsed }
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e)
  }
  return INITIAL_STATE
}

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Error saving state to localStorage:', e)
  }
}

export const calculateXPAndLevel = (currentXP) => {
  // 100 XP per level
  const level = Math.floor(currentXP / 100) + 1
  const xpInCurrentLevel = currentXP % 100
  return { level, xpInCurrentLevel }
}

export const getDaysRemainingInYear = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999)
  const diffMs = endOfYear - now
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diffMs / 1000 / 60) % 60)
  const seconds = Math.floor((diffMs / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export const exportDataAsJSON = (state) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", `sprint84_backup_${new Date().toISOString().split('T')[0]}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
}

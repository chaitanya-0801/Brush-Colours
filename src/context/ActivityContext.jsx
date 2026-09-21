import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'

const ActivityContext = createContext(null)

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([])
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [activityError, setActivityError] = useState('')

  const refreshActivities = async () => {
    try {
      const result = await api.getActivities()
      setActivities(result.activities)
      setActivityError('')
      return result.activities
    } catch (error) {
      setActivityError(error.message)
      throw error
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    refreshActivities().catch(() => {})
  }, [])

  const value = useMemo(() => ({ activities, loadingActivities, activityError, refreshActivities }), [activities, loadingActivities, activityError])
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export const useActivities = () => useContext(ActivityContext)

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { activities as catalogueActivities } from '../data'

const ActivityContext = createContext(null)

const mergeActivities = (backendActivities) => catalogueActivities.map((activity) => ({
  ...activity,
  ...(backendActivities.find((item) => item.id === activity.id) || {}),
}))

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState(catalogueActivities)

  const refreshActivities = async () => {
    const result = await api.getActivities()
    setActivities(mergeActivities(result.activities))
    return result.activities
  }

  useEffect(() => {
    refreshActivities().catch(() => {})
  }, [])

  const value = useMemo(() => ({ activities, refreshActivities }), [activities])
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export const useActivities = () => useContext(ActivityContext)

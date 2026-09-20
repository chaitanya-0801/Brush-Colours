import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.me().then(({ user: currentUser }) => setUser(currentUser)).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    async login(details) {
      const result = await api.login(details)
      setUser(result.user)
      return result.user
    },
    async register(details) {
      const result = await api.register(details)
      setUser(result.user)
      return result.user
    },
    async logout() {
      await api.logout()
      setUser(null)
    },
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

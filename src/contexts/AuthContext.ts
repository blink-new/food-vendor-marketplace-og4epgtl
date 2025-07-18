import { createContext } from 'react'

export interface User {
  id: string
  email: string
  displayName: string
  userType?: 'landlord' | 'vendor'
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
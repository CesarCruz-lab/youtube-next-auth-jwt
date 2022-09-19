import Router from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { setCookie, parseCookies } from 'nookies'

import { recoverUserInformation, signInRequest } from 'services/auth'
import { api } from 'services/api'

type SignInData = {
  email: string
  password: string
}

type User = {
  name: string
  email: string
  avatar_url: string
}

type AuthContextType = {
  user: User
  isAuthenticated: boolean
  signIn(data: SignInData): Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  async function signIn({ email, password }: SignInData) {
    const { token, user } = await signInRequest({ email, password })

    setCookie(undefined, 'next-auth.token', token, {
      maxAge: 60 * 60 * 1, // 1 hour
    })

    setUser(user)

    api.defaults.headers['Authorization'] = `Bearer ${token}`

    Router.push('/dashboard')
  }

  useEffect(() => {
    const { 'next-auth.token': token } = parseCookies()

    if (token) {
      recoverUserInformation().then(({ user }) => setUser(user))
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

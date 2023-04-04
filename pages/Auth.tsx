import React, { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession()

  useEffect(() => {
    if (status === AUTH.LOADING) return
    if (status === AUTH.UNAUTHENTICATED) signIn()
    console.log('INSIDE USE EFFECT')
    console.log('status', status)
  }, [status])

  if (status === AUTH.AUTHENTICATED) {
    return <>{children}</>
  }

  return <div>...Loading</div>
}

enum AUTH {
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
}

export default Auth

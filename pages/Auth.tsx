import React, { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession()

  useEffect(() => {
    if (status === AUTH.LOADING) return
    if (status === AUTH.UNAUTHENTICATED) signIn()
  }, [status])

  if (status === AUTH.AUTHENTICATED) {
    return <>{children}</>
  }

  return <div>...Loading 1</div>
}

enum AUTH {
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
}

export const getStaticProps = async () => {
  return {
    props: {
      adobeURL: process.env.ADOBE_ANALYTICS_URL,
    },
  }
}

export default Auth

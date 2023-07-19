import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import Auth from '../components/Layout/Auth'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router: { route },
}: AppProps) {
  const AuthRequired =
    process.env.APP_ENV !== 'production' && process.env.APP_ENV !== 'alpha'

  return (
    <>
      {AuthRequired ? (
        <SessionProvider session={session}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </SessionProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )
}

export default MyApp

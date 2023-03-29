import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import Auth from './Auth'

const PRIVATE_PATHS = ['/', '/eligibility', '/results']
console.log(process.env.NEXTAUTH_URL)

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router: { route },
}: AppProps) {
  const AuthRequired = PRIVATE_PATHS.some((path) => route.startsWith(path))
  return (
    <SessionProvider session={session}>
      {/*<Script src="/scripts/adobe.js" />*/}
      {/* the below line appears to crash the page - to investigate if it's even needed at all */}
      {/*<script type="text/javascript">_satellite.pageBottom()</script>*/}
      {AuthRequired ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  )
}

export default MyApp

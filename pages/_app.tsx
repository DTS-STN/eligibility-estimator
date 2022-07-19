import type { AppProps } from 'next/app'
import '../styles/globals.css'

// import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/*<Script src="/scripts/adobe.js" />*/}
      {/* the below line appears to crash the page - to investigate if it's even needed at all */}
      {/*<script type="text/javascript">_satellite.pageBottom()</script>*/}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

import type { AppProps } from 'next/app'
import { LanguageProvider, StoreProvider } from '../components/Contexts'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </StoreProvider>
  )
}

export default MyApp

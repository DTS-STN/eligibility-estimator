import { Head, Html, Main, NextScript } from 'next/document'

// This file is executed server-side only, for pre-rendering.

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

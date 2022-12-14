import { Head, Html, Main, NextScript } from 'next/document'

// This file is executed server-side only, for pre-rendering.

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://code.jquery.com/jquery-3.6.2.min.js"
          integrity="sha256-2krYZKh//PcchRtd+H+VyyQoZ/e3EcrkxhM8ycwASPA="
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

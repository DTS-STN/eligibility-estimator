import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="/scripts/adobe.js"></script>
        <script type="text/javascript">_satellite.pageBottom()</script>
      </body>
    </Html>
  )
}

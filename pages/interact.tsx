import Head from 'next/head'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const App = () => (
  <>
    <Head>
      <title>Benefits Eligibility API Testing</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <SwaggerUI
      url="openapi.yaml"
      defaultModelExpandDepth={2}
      defaultModelsExpandDepth={2}
      docExpansion="full"
      deepLinking={true}
    />
  </>
)

export default App

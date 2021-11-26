import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const App = () => (
  <SwaggerUI
    url="openapi.yaml"
    defaultModelExpandDepth={2}
    defaultModelsExpandDepth={2}
    docExpansion="full"
    deepLinking={true}
  />
)

export default App

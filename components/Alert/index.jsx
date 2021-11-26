import React from 'react'

export const Alert = ({ type, title, content }) => {
  return (
    <section>
      {title && <h3>(Title)</h3>}
      <p>(Success content here.)</p>
    </section>
  )
}

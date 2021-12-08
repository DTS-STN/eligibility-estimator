import { FormEvent, useEffect, useState } from 'react'
import { Input } from './Input'
import { Radio } from './Radio'
import { Select } from './Select'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'

export const ComponentFactory: React.FC<{ data: any }> = ({ data }) => {
  const { query } = useRouter()
  const [formState, setFormState] = useState(data.fieldData)
  // track lastCategory so we can render a new header when it has changed
  let lastCategory = null

  const handleChange = async (e) => {
    const formData = new FormData(document.querySelector('form'))
    const qs = Array.from(formData, (e: [string, any]) =>
      e.map(encodeURIComponent).join('=')
    ).join('&')
    const newFormData = await fetch(`api/calculateEligibility?${qs}`).then(
      (res) => res.json()
    )

    console.log(newFormData)
    setFormState(newFormData.fieldData)
  }

  return (
    <form name="ee-form" data-testid="ee-form" noValidate>
      {console.log(formState)}
      {formState.map((field) => {
        const content = (
          <div key={field.key} className="">
            {field.category != lastCategory && (
              <h2 className="h2 mb-4">{field.category}</h2>
            )}
            {(field.type == 'number' || field.type == 'text') && (
              <div className="mb-12">
                <Input
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  placeholder={field.placeholder ?? ''}
                  onChange={debounce(handleChange, 1000)}
                  required
                />
              </div>
            )}
            {field.type == 'dropdown' && (
              <div className="mb-12">
                <Select
                  options={field.values}
                  label={field.label}
                  keyForId={field.key}
                  onChange={handleChange}
                />
              </div>
            )}
            {(field.type == 'radio' || field.type == 'boolean') && (
              <div className="mb-12">
                <Radio
                  values={
                    field.type == 'boolean' ? ['Yes', 'No'] : field.values
                  }
                  keyForId={field.key}
                  label={field.label}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>
        )
        lastCategory = field.category

        return content
      })}
    </form>
  )
}

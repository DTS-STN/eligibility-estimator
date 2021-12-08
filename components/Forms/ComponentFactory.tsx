import { Input } from './Input'
import { Radio } from './Radio'
import { Select } from './Select'

export const ComponentFactory: React.FC<{ data: any }> = ({ data }) => {
  console.log(data.visibleFields)
  // track lastCategory so we can render a new header when it has changed
  let lastCategory = null
  return (
    <form action="/eligibility">
      {data.fieldData.map((field) => {
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

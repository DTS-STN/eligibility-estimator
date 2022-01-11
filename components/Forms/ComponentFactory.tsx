import { debounce, sortBy } from 'lodash'
import { useRouter } from 'next/router'
import React, { Dispatch, useEffect, useState } from 'react'
import { FieldKey, FieldType } from '../../utils/api/definitions/fields'
import type { ResponseSuccess } from '../../utils/api/definitions/types'
import { validateIncome } from '../../utils/api/helpers/validator'
import { useStore } from '../Hooks'
import { CurrencyField } from './CurrencyField'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { observer } from 'mobx-react'
import { RootStore } from '../../client-state/store'
import type { Instance } from 'mobx-state-tree'
import { FieldCategory } from '../../utils/api/definitions/enums'
import type { Form } from '../../client-state/models/Form'
import type { FormField } from '../../client-state/models/FormField'
import { NumberField } from './NumberField'
import { TextField } from './TextField'

interface FactoryProps {
  data: ResponseSuccess
  selectedTabIndex: Dispatch<number>
}

/** API endpoint for eligibility*/
const API_URL = `api/calculateEligibility`

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 * @param props {FactoryProps}
 * @returns
 */
export const ComponentFactory: React.VFC<FactoryProps> = observer(
  ({ data, selectedTabIndex }) => {
    let lastCategory = null

    const router = useRouter()
    const query = router.query

    const root: Instance<typeof RootStore> = useStore()
    const form: Instance<typeof Form> = root.form

    if (form.empty) {
      form.setupForm(data.fieldData)
    }

    useEffect(() => {
      //set income from query parameter if exists and only run on initial draw
      if (query[FieldKey.INCOME] !== '') {
        form.getFieldByKey(FieldKey.INCOME).setValue(query[FieldKey.INCOME])
      }
    }, [query[FieldKey.INCOME]])

    return (
      <form
        name="ee-form"
        data-testid="ee-form"
        action="/eligibility"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <input type="hidden" name="_language" value={'EN'} />
        {form.fields.map((field: Instance<typeof FormField>) => {
          const isChildQuestion =
            field.category.key == FieldCategory.PARTNER_DETAILS ||
            field.category.key == FieldCategory.SOCIAL_AGREEMENT
              ? true
              : false
          const styling = isChildQuestion
            ? `bg-emphasis px-10 ${
                field.category.key == FieldCategory.SOCIAL_AGREEMENT
                  ? ' mb-4'
                  : ''
              }`
            : ``
          const content = (
            <div key={field.key} className={styling}>
              {field.category.key != lastCategory && (
                <h2 className={isChildQuestion ? 'h2 pt-10' : 'h2 my-8'}>
                  {field.category.text}
                </h2>
              )}
              {field.type == FieldType.CURRENCY && (
                <div className="pb-8">
                  <CurrencyField
                    type={field.type}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder ?? ''}
                    onChange={debounce(field.handleChange, 1000)}
                    value={field.value}
                    error={field.error}
                    required
                  />
                </div>
              )}
              {field.type == FieldType.NUMBER && (
                <div className="pb-8">
                  <NumberField
                    type={field.type}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder ?? ''}
                    onChange={debounce(field.handleChange, 1000)}
                    value={field.value}
                    error={field.error}
                    required
                  />
                </div>
              )}
              {field.type == FieldType.STRING && (
                <div className="pb-8">
                  <TextField
                    type={field.type}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder ?? ''}
                    onChange={debounce(field.handleChange, 1000)}
                    value={field.value}
                    error={field.error}
                    required
                  />
                </div>
              )}
              {field.type == 'dropdown' && (
                <div className="pb-8">
                  <FormSelect field={field} error={field.error} value={null} />
                </div>
              )}
              {(field.type == 'radio' || field.type == 'boolean') && (
                <div className="pb-8">
                  <Radio
                    name={field.key}
                    checkedValue={field.value}
                    values={
                      field.type == 'boolean'
                        ? [
                            { key: 'true', text: 'Yes' },
                            { key: 'false', text: 'No' },
                          ]
                        : field.options
                    }
                    keyforid={field.key}
                    label={field.label}
                    onChange={field.handleChange}
                    error={field.error}
                    required
                  />
                </div>
              )}
            </div>
          )
          lastCategory = field.category.key

          return content
        })}

        <div className="flex flex-col md:flex-row gap-x-8 mt-20">
          <button
            type="button"
            role="navigation"
            className="btn btn-default w-full md:w-40"
            onClick={(e) => router.push('/')}
          >
            Back
          </button>
          <button
            type="button"
            role="button"
            className="btn btn-default w-full md:w-40 mt-4 md:mt-0"
            onClick={(e) => {
              form.clearForm()
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            role="button"
            className="btn btn-primary w-full md:w-40 mt-4 md:mt-0"
            onClick={async (e) => {
              if (!form.validateAgainstEmptyFields() && !form.hasErrors) {
                selectedTabIndex(1)
              }
            }}
          >
            Estimate
          </button>
        </div>
      </form>
    )
  }
)

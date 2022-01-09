import { debounce, sortBy } from 'lodash'
import { useRouter } from 'next/router'
import React, { Dispatch, useState } from 'react'
import { FieldData, FieldKey } from '../../utils/api/definitions/fields'
import type {
  BenefitResult,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { validateIncome } from '../../utils/api/helpers/validator'
import { useStore } from '../Hooks'
import { fixedEncodeURIComponent } from '../../utils/api/helpers/webUtils'
import { Input } from './Input'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { observer } from 'mobx-react'
import { Form, FormField, RootStore } from '../../client-state/store'
import type { Instance } from 'mobx-state-tree'
import { FieldCategory } from '../../utils/api/definitions/enums'

interface FactoryProps {
  data: ResponseSuccess
  setProgress: Dispatch<any>
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
  ({ data, selectedTabIndex, setProgress }) => {
    let lastCategory = null

    const router = useRouter()
    const query = router.query

    const root: Instance<typeof RootStore> = useStore()
    const form: Instance<typeof Form> = root.form

    console.log(data)

    if (form.empty) {
      form.setupForm(data.fieldData)
    }

    //set income from query parameter if exists
    if (query[FieldKey.INCOME] !== '') {
      form.getFieldByKey(FieldKey.INCOME).setValue(query[FieldKey.INCOME])
    }

    return (
      <form
        name="ee-form"
        data-testid="ee-form"
        action="/eligibility"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* 
      <input
        type="hidden"
        name="lang"
        value={useInternationalization('lang')}
      /> 
      */}
        {form.fields.map((field: Instance<typeof FormField>) => {
          const isChildQuestion =
            field.category ==
            (FieldCategory.PARTNER_DETAILS || 'Social Agreement Countries') // TODO: need to add this category on the API
              ? true
              : false

          const content = (
            <div
              key={field.key}
              className={isChildQuestion ? `bg-emphasis px-10` : ``}
            >
              {field.category != lastCategory && (
                <h2 className={isChildQuestion ? 'h2 pt-10' : 'h2 my-8'}>
                  {field.category}
                </h2>
              )}
              {field.type == 'number' && (
                <div className="pb-8">
                  <Input
                    type={field.type}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder ?? ''}
                    onChange={debounce(field.handleChange, 1000)}
                    value={field?.value}
                    data-category={field.category}
                    // error={error[field.key] ?? undefined}
                    required
                  />
                </div>
              )}
              {field.type == 'dropdown' && (
                <div className="pb-8">
                  <FormSelect
                    field={field}
                    // error={error[field.key] ?? undefined}
                    value={field.value}
                  />
                </div>
              )}
              {(field.type == 'radio' || field.type == 'boolean') && (
                <div className="pb-8">
                  <Radio
                    name={field.key}
                    value={field.value}
                    values={
                      field.type == 'boolean' ? ['Yes', 'No'] : field.options
                    }
                    keyforid={field.key}
                    label={field.label}
                    onChange={field.handleChange}
                    category={field.category}
                    //error={error[field.key] ?? undefined}
                    required
                  />
                </div>
              )}
            </div>
          )
          lastCategory = field.category

          return content
        })}

        <div className="flex flex-col md:flex-row gap-x-8 mt-20">
          <button
            type="button"
            role="button"
            className="btn btn-default w-full md:w-40"
            onClick={(e) => router.push('/')}
          >
            Back
          </button>
          <button
            type="reset"
            className="btn btn-default w-full md:w-40 mt-4 md:mt-0"
            onClick={(e) => {
              const form: HTMLFormElement = document.querySelector(
                "form[name='ee-form']"
              )
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            role="button"
            className="btn btn-primary w-full md:w-40 mt-4 md:mt-0"
            onClick={(e) => {
              // field.handleChange()
              // // validate against empty inputs in the form and setError
              // const emptyFields = validateAgainstEmptyFormFields(
              //   formState,
              //   formCompletion
              // )
              // if (Object.keys(emptyFields).length === 0) {
              //   selectedTabIndex(1)
              // } else {
              //   setError(emptyFields)
              // }
            }}
          >
            Estimate
          </button>
        </div>
      </form>
    )
  }
)

/**
 *
 * @param formElements the field data array from the current form
 * @param formCompletion the global form completion state
 * @returns true if the form is valid, false if it has empty fields
 */
const validateAgainstEmptyFormFields = (
  formElements: FieldData[],
  formCompletion: Record<string, any>
): Record<string, string> => {
  const emptyFields: Record<string, string> = {}

  // find the empty form fields and create the expected shape
  for (const element of formElements) {
    if (formCompletion[element.key] === undefined) {
      emptyFields[element.key] = 'This field is required'
    }
  }

  return emptyFields
}

const validateFieldsAgainstAPIErrors = (
  detailedErrorData: any
): Record<string, string> => {
  return {
    age: 'Age must be less than or equal to 150',
    yearsInCanadaSince18: 'Years in Canada should be no more than age minus 18',
  }
}

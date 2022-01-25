import { debounce } from 'lodash'
import { observer } from 'mobx-react'
import type { Instance } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import React, { Dispatch, useEffect } from 'react'
import type { Form } from '../../client-state/models/Form'
import type { FormField } from '../../client-state/models/FormField'
import { RootStore } from '../../client-state/store'
import {
  EstimationSummaryState,
  FieldCategory,
} from '../../utils/api/definitions/enums'
import { FieldKey, FieldType } from '../../utils/api/definitions/fields'
import type { ResponseSuccess } from '../../utils/api/definitions/types'
import { useStore } from '../Hooks'
import { CurrencyField } from './CurrencyField'
import { NumberField } from './NumberField'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { TextField } from './TextField'
import { NeedHelpList } from '../Layout/NeedHelpList'
import { Alert } from '../Alert'
import ProgressBar from '../ProgressBar'

interface FactoryProps {
  data: ResponseSuccess
  selectedTabIndex: Dispatch<number>
}

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

    const root: Instance<typeof RootStore> = useStore()
    const form: Instance<typeof Form> = root.form

    if (form.empty) {
      form.setupForm(data.fieldData)
      root.setSummary(data.summary)
    }

    // check if income is too high to participate in calculation
    const incomeTooHigh = form.validateIncome()

    return (
      <>
        {incomeTooHigh ? (
          <Alert title={root.summary.title} type={root.summary.state}>
            {root.summary.details}
          </Alert>
        ) : (
          <ProgressBar
            sections={[
              {
                title: 'Income Details',
                complete: root.form.progress.income,
              },
              {
                title: 'Personal Information',
                complete: root.form.progress.personal,
              },
              {
                title: 'Legal Status',
                complete: root.form.progress.legal,
              },
            ]}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 mt-10">
          <form
            name="ee-form"
            data-testid="ee-form"
            action="/eligibility"
            onSubmit={(e) => e.preventDefault()}
            className="col-span-2"
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
                ? `bg-emphasis px-10 lg:w-[1200px] md:w-[992px]  ${
                    field.category.key == FieldCategory.SOCIAL_AGREEMENT
                      ? ' mb-10'
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
                        onChange={field.handleChange}
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
                        onChange={field.handleChange}
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
                        onChange={field.handleChange}
                        value={field.value}
                        error={field.error}
                        required
                      />
                    </div>
                  )}
                  {(field.type == FieldType.DROPDOWN ||
                    field.type == FieldType.DROPDOWN_SEARCHABLE) && (
                    <div className="pb-8">
                      <FormSelect
                        field={field}
                        error={field.error}
                        value={null}
                      />
                    </div>
                  )}
                  {(field.type == FieldType.RADIO ||
                    field.type == FieldType.BOOLEAN) && (
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3.5 md:gap-x-8 mt-20">
              <button
                type="button"
                role="navigation"
                className="btn btn-default mt-4 md:mt-0"
                onClick={(e) => router.push('/')}
              >
                Back
              </button>
              <button
                type="button"
                role="button"
                className="btn btn-default mt-4 md:mt-0"
                onClick={(e) => {
                  form.clearForm()
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                role="button"
                className="btn btn-primary mt-4 md:mt-0 col-span-2 md:col-span-1 disabled:cursor-not-allowed disabled:bg-[#949494] disabled:border-0"
                onClick={async (e) => {
                  if (!form.validateAgainstEmptyFields() && !form.hasErrors) {
                    selectedTabIndex(1)
                  }
                }}
                disabled={form.validateIncome()}
              >
                Estimate
              </button>
            </div>
          </form>
          <NeedHelpList title="Need Help?" links={root.summary.links} />
        </div>
      </>
    )
  }
)

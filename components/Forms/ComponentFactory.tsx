import { observer } from 'mobx-react'
import type { Instance } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import type { Form } from '../../client-state/models/Form'
import type { FormField } from '../../client-state/models/FormField'
import { RootStore } from '../../client-state/store'
import { WebTranslations } from '../../i18n/web'
import { FieldCategory, Language } from '../../utils/api/definitions/enums'
import { FieldType } from '../../utils/api/definitions/fields'
import type { ResponseSuccess } from '../../utils/api/definitions/types'
import { Alert } from '../Alert'
import { useStore, useTranslation } from '../Hooks'
import { NeedHelpList } from '../Layout/NeedHelpList'
import ProgressBar from '../ProgressBar'
import { CurrencyField } from './CurrencyField'
import { NumberField } from './NumberField'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { TextField } from './TextField'

interface FactoryProps {
  data: ResponseSuccess
}

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 * @param props {FactoryProps}
 * @returns
 */
export const ComponentFactory: React.VFC<FactoryProps> = observer(
  ({ data }) => {
    let lastCategory = null

    const router = useRouter()
    const tsln = useTranslation<WebTranslations>()

    const root: Instance<typeof RootStore> = useStore()
    const form: Instance<typeof Form> = root.form

    if (form.empty) {
      form.setupForm(data.fieldData)
      root.setSummary(data.summary)
    }

    // check if income is too high to participate in calculation, and fix a bug with headless ui tabs where they only re-render on interaction
    const incomeTooHigh = form.validateIncome()
    useEffect(() => {
      if (process.browser) {
        const results = document.getElementsByClassName('results-tab')[0]
        if (results) {
          if (form.isIncomeTooHigh) {
            results.setAttribute('disabled', 'disabled')
          } else {
            results.removeAttribute('disabled')
          }
        }
      }
    }, [form.isIncomeTooHigh])

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
                title: tsln.category.incomeDetails,
                complete: root.form.progress.income,
              },
              {
                title: tsln.category.personalInformation,
                complete: root.form.progress.personal,
              },
              {
                title: tsln.category.legalStatus,
                complete: root.form.progress.legal,
              },
            ]}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 mt-10">
          <form
            name="ee-form"
            data-testid="ee-form"
            action="../../pages/eligibility"
            onSubmit={(e) => e.preventDefault()}
            className="col-span-2"
            noValidate
          >
            <input
              type="hidden"
              name="_language"
              id="_language"
              value={router.locale == 'en' ? Language.EN : Language.FR}
            />
            {form.fields.map((field: Instance<typeof FormField>) => {
              const isChildQuestion =
                field.category.key == FieldCategory.PARTNER_DETAILS ||
                field.category.key == FieldCategory.SOCIAL_AGREEMENT
              const styling = isChildQuestion
                ? `bg-emphasis px-10 ${
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
                        name={field.key}
                        field={field}
                        error={field.error}
                        placeholder={getPlaceholderForSelect(field, tsln)}
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
                                {
                                  key: 'true',
                                  text: tsln.yes,
                                },
                                {
                                  key: 'false',
                                  text: tsln.no,
                                },
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
                onClick={() => router.push('/')}
              >
                {tsln.next}
              </button>
              <button
                type="button"
                role="button"
                className="btn btn-default mt-4 md:mt-0"
                onClick={() => {
                  form.clearForm()
                }}
              >
                {tsln.clear}
              </button>
              <button
                type="submit"
                role="button"
                className="btn btn-primary mt-4 md:mt-0 col-span-2 md:col-span-1 disabled:cursor-not-allowed disabled:bg-[#949494] disabled:border-0"
                onClick={async () => {
                  if (
                    !form.validateAgainstEmptyFields(router.locale) &&
                    !form.hasErrors
                  ) {
                    const language = document.querySelector(
                      '#_language'
                    ) as HTMLInputElement
                    root.setCurrentLang(language.value as Language)
                    root.setActiveTab(1)
                  }
                }}
                disabled={incomeTooHigh}
              >
                {tsln.estimate}
              </button>
            </div>
          </form>
          <NeedHelpList title={tsln.needHelp} links={root.summary.links} />
        </div>
      </>
    )
  }
)

const getPlaceholderForSelect = (
  field: Instance<typeof FormField>,
  tsln: WebTranslations
) => {
  let text = tsln.selectText[field.key]
  return text ? text : tsln.selectText.default
}

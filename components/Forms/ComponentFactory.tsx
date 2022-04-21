import { debounce } from 'lodash'
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
import MainHandler from '../../utils/api/mainHandler'
import { FAQ } from '../FAQ'
import { useMediaQuery, useStore, useTranslation } from '../Hooks'
import { NeedHelp } from '../NeedHelp'
import { CurrencyField } from './CurrencyField'
import { FormButtons } from './FormButtons'
import { NumberField } from './NumberField'
import { Radio } from './Radio'
import { FormSelect } from './Select'
import { TextField } from './TextField'

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 */
export const ComponentFactory: React.VFC = observer(({}) => {
  console.log('rendering factory ')
  let lastCategory = null

  const router = useRouter()
  const locale = router.locale
  const tsln = useTranslation<WebTranslations>()
  const isMobile = useMediaQuery(992)

  const root: Instance<typeof RootStore> = useStore()
  const form: Instance<typeof Form> = root.form

  const input = root.getInputObject()
  input._language = locale
  const data = new MainHandler(input).results

  // on mobile only, captures enter keypress, does NOT submit form, and blur (hide) keyboard
  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (isMobile && event.key == 'Enter') {
        const el = document.activeElement as HTMLInputElement
        el.blur()
      }
    })
  }, [isMobile])

  if ('error' in data) {
    // typeof data == ResponseError
    // TODO: when error, the form does not update. Repro: set age to 200, change marital from single to married, notice partner questions don't show
    console.log('Data update resulted in error:', data)
  }

  if ('fieldData' in data) {
    // typeof data == ResponseSuccess
    form.setupForm(data.fieldData)
    root.setSummary(data.summary)
  }

  return (
    <>
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
          {form.fields.map(
            (field: Instance<typeof FormField>, index: number) => {
              console.log('rendering ', field.label)
              const isChildQuestion =
                field.category.key == FieldCategory.PARTNER_INFORMATION
              const styling = isChildQuestion ? 'bg-emphasis px-10 pt-4' : ''
              const content = (
                <div key={field.key} className={styling}>
                  {field.category.key != lastCategory && (
                    <h2
                      className={
                        isChildQuestion
                          ? 'h2 mb-8 text-content'
                          : `h2 text-content ${index == 0 ? 'mb-8' : 'my-8'}`
                      }
                    >
                      {field.category.text}
                    </h2>
                  )}
                  {field.type == FieldType.CURRENCY && (
                    <div className="pb-10">
                      <CurrencyField
                        type={field.type}
                        name={field.key}
                        label={field.label}
                        onChange={field.handleChange}
                        placeholder={field.placeholder ?? ''}
                        value={field.value}
                        error={field.error}
                        required
                      />
                    </div>
                  )}
                  {field.type == FieldType.NUMBER && (
                    <div className="pb-10">
                      <NumberField
                        type={field.type}
                        name={field.key}
                        label={field.label}
                        placeholder={field.placeholder ?? ''}
                        onChange={debounce(field.handleChange, 300)}
                        value={field.value}
                        error={field.error}
                        required
                      />
                    </div>
                  )}
                  {field.type == FieldType.STRING && (
                    <div className="pb-10">
                      <TextField
                        type={field.type}
                        name={field.key}
                        label={field.label}
                        placeholder={field.placeholder ?? ''}
                        onChange={debounce(field.handleChange, 300)}
                        value={field.value}
                        error={field.error}
                        required
                      />
                    </div>
                  )}
                  {(field.type == FieldType.DROPDOWN ||
                    field.type == FieldType.DROPDOWN_SEARCHABLE) && (
                    <div className="pb-10">
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
                    <div className="pb-10">
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
            }
          )}

          <FormButtons />
        </form>
        <NeedHelp title={tsln.needHelp} links={root.summary.needHelpLinks} />
      </div>

      <FAQ />
    </>
  )
})

const getPlaceholderForSelect = (
  field: Instance<typeof FormField>,
  tsln: WebTranslations
) => {
  let text = tsln.selectText[field.key]
  return text ? text : tsln.selectText.default
}

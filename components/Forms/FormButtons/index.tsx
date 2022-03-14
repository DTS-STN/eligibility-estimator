import { Instance } from 'mobx-state-tree'
import { NextRouter, useRouter } from 'next/router'
import { Form } from '../../../client-state/models/Form'
import { RootStore } from '../../../client-state/store'
import { WebTranslations } from '../../../i18n/web'
import { Language } from '../../../utils/api/definitions/enums'
import { useMediaQuery, useStore, useTranslation } from '../../Hooks'

export const FormButtons: React.FC<{}> = ({}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()
  const root = useStore()
  const form = root.form
  const isMobile = useMediaQuery(992)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3.5 md:gap-x-8 mt-20">
      {isMobile && (
        <SubmitButton
          label={tsln.getResults}
          router={router}
          root={root}
          form={form}
        />
      )}
      <button
        type="button"
        role="navigation"
        className="btn btn-default mt-4 md:mt-0"
        onClick={() => router.push('/')}
      >
        {tsln.back}
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
      {!isMobile && (
        <SubmitButton
          label={tsln.getResults}
          router={router}
          root={root}
          form={form}
        />
      )}
    </div>
  )
}

const SubmitButton: React.FC<{
  router: NextRouter
  form: Instance<typeof Form>
  root: Instance<typeof RootStore>
  label: string
}> = ({ router, form, root, label }) => {
  return (
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
    >
      {label}
    </button>
  )
}

import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { WebTranslations } from '../../i18n/web'
import MainHandler from '../../utils/api/mainHandler'
import { useMediaQuery, useTranslation } from '../Hooks'
import { FormButtons } from './FormButtons'
import { AccordionFormContainer } from './AccordionFormContainer'

/**
 * A component that will receive backend props from an API call and render the data as an interactive form.
 * `/interact` holds the swagger docs for the API response, and `fieldData` is the iterable that contains the form fields to be rendered.
 */
export const ComponentFactory: React.VFC = () => {
  const router = useRouter()
  const locale = router.locale
  const isMobile = useMediaQuery(992)

  const [data, setData] = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('data')) {
      const data = JSON.parse(sessionStorage.getItem('data'))
      setData(data)
    } else {
      const dataObj = new MainHandler({ _language: locale }).results
      sessionStorage.setItem('data', JSON.stringify(dataObj))
      setData(dataObj)
    }
  }, [])

  useEffect(() => {
    const dataObj = new MainHandler({ _language: locale }).results
    sessionStorage.setItem('data', JSON.stringify(dataObj))
    setData(dataObj)
  }, [locale])

  // on mobile only, captures enter keypress, does NOT submit form, and blur (hide) keyboard
  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      if (isMobile && event.key == 'Enter') {
        const el = document.activeElement as HTMLInputElement
        el.blur()
      }
    })
  }, [isMobile])

  const handleOnChange = (step, field, event) => {
    console.log(`step`, step)
    console.log(`field`, field)
    console.log(`event`, event)

    // if (event.target.value === 23) {
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData['step1'].isValid = true
    //     return updatedCardsData
    //   })
    // }
    // if (event.target.value === '23') {
    //   console.log('INSIDE SUCCESS')
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData[step].isValid = true
    //     return updatedCardsData
    //   })
    // } else {
    //   setCardsValid((currentCardsData) => {
    //     const updatedCardsData = { ...currentCardsData }
    //     updatedCardsData[step].isValid = false
    //     return updatedCardsData
    //   })
    // }
    // field.handleChange(event)
  }

  return (
    <>
      {data && (
        <AccordionFormContainer data={data} handleOnChange={handleOnChange} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 mt-10">
        <div className="col-span-2">
          <FormButtons />
        </div>
      </div>
    </>
  )
}

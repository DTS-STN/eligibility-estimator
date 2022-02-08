import React from 'react'
import { useStore } from '../Hooks'

export const ActionDropdown = () => {
  const form = useStore().form
  const [show, setShow] = React.useState<boolean>(false)
  const wrapperRef = React.useRef(null)

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow(false)
    }
  }

  const handleEscPress = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keyup', handleEscPress)
  })

  return (
    <div ref={wrapperRef}>
      <button className="btn btn-primary px-8" onClick={(e) => setShow(!show)}>
        <span className="gap-x-3 flex items-center">
          <span>Save results</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={
          show
            ? 'bg-white border border-form-border rounded mt-2 py-3 w-[270px] absolute shadow-xl flex flex-col'
            : 'hidden'
        }
      >
        <button
          className="btn btn-link text-left"
          onClick={(e) => {
            if (process.browser) {
              const path = `${window.location.host}${window.location.pathname}`
              const query = `?${form.buildQueryStringWithFormData()}`

              navigator.clipboard.writeText(path + query)

              alert('Copied to clipboard!')
              setShow(false)
            }
          }}
        >
          Copy link to clipboard
        </button>
        <button
          className="btn btn-link text-left"
          onClick={(e) => {
            // todo
          }}
        >
          Save to CSV
        </button>
      </div>
    </div>
  )
}

import React, { useLayoutEffect, useRef, useState } from 'react'

export const Tooltip: React.VFC<{ text?: string; size?: number }> = ({
  text,
  size,
}) => {
  const [show, setShow] = useState<boolean>(false)
  const wrapperRef = useRef(null)

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

  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keyup', handleEscPress)
  })

  return (
    <span className="ml-2 absolute" ref={wrapperRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="none"
        className="cursor-pointer"
        onClick={(e) => setShow(true)}
      >
        <path
          d="M12.5 0C5.597 0 0 5.599 0 12.5 0 19.405 5.597 25 12.5 25S25 19.405 25 12.5C25 5.599 19.403 0 12.5 0Zm0 5.544a2.117 2.117 0 1 1 0 4.234 2.117 2.117 0 0 1 0-4.234Zm2.823 12.803c0 .334-.271.605-.605.605h-4.436a.605.605 0 0 1-.605-.605v-1.21c0-.334.271-.605.605-.605h.605v-3.226h-.605a.605.605 0 0 1-.605-.604v-1.21c0-.334.271-.605.605-.605h3.226c.334 0 .605.27.605.605v5.04h.605c.334 0 .605.271.605.605v1.21Z"
          className="text-primary fill-current"
        />
      </svg>
      <div className={`${show ? '' : 'hidden'}`} tabIndex={-1}>
        <div
          className={`flex flex-row items-start gap-x-5 max-w-[525px] p-5 shadow-md rounded border border-[#C7CFEF] bg-white relative -top-12 -left-5 z-10`}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={`${size ? size : 25}`}
              height={`${size ? size : 25}`}
              className="inline-block"
            >
              <path
                d="M12.5 0C5.597 0 0 5.599 0 12.5 0 19.405 5.597 25 12.5 25S25 19.405 25 12.5C25 5.599 19.403 0 12.5 0Zm0 5.544a2.117 2.117 0 1 1 0 4.234 2.117 2.117 0 0 1 0-4.234Zm2.823 12.803c0 .334-.271.605-.605.605h-4.436a.605.605 0 0 1-.605-.605v-1.21c0-.334.271-.605.605-.605h.605v-3.226h-.605a.605.605 0 0 1-.605-.604v-1.21c0-.334.271-.605.605-.605h3.226c.334 0 .605.27.605.605v5.04h.605c.334 0 .605.271.605.605v1.21Z"
                className="text-primary fill-current"
              />
            </svg>
          </div>
          <p className="font-normal z">{text}</p>
        </div>
      </div>
    </span>
  )
}

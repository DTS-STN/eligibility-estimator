import React from 'react'
import Image from 'next/image'
import { useInternationalization } from '../Hooks'

export const Header = () => (
  <header className="border-b border-black/20 pb-10 -mx-4">
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <Image
          src="/gc-sig.png"
          width="360px"
          height="34px"
          alt="Government of Canada banner image"
        />
        <label htmlFor="search-gc" className="block mb-2">
          <input
            type="search"
            id="search-gc"
            placeholder={useInternationalization('search')}
            className="h-auto min-h-9 py-1.5 px-3 align-middle text-muted bg-white rounded-tl rounded-bl border-[1px] border-solid border-form-border focus:border-form-highlighted focus:shadow-active-form"
          />
          <button className="py-1.5 px-3 h-[38px] rounded-tr rounded-br text-white bg-primary hover:bg-primary-hover border-primary-border font-normal text-base text-center whitespace-nowrap align-middle cursor-pointer border-[1px] border-solid">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </label>
      </div>
    </div>
  </header>
)

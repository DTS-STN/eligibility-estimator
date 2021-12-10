import * as React from 'react'

type Section = { title: string; complete: boolean; first?: boolean }

interface ProgressBarProps {
  sections: Section[]
  estimateSection?: boolean
}

const ProgressSection: React.FC<Section> = ({ title, complete, first }) => {
  return (
    <>
      {!first && (
        <div
          className={`flex-auto border-t-4 ${
            complete ? 'text-primary' : 'text-[#B7B7B7]'
          }`}
        ></div>
      )}

      <div className="flex items-center">
        <svg
          width="28"
          height="28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${
            complete ? 'text-primary' : 'text-[#B7B7B7]'
          } fill-current stroke-white`}
        >
          <rect
            x="1.5"
            y="26.5"
            width="26"
            height="26"
            rx="12.5"
            transform="rotate(-90 1.5 26.5)"
            strokeWidth="3"
          />
          <path
            d="m6 14.214 5.321 5.179L22.571 8"
            strokeWidth="3"
            strokeLinejoin="round"
            stroke={complete ? '#fff' : 'text-[#B7B7B7]'}
          />
        </svg>
        <span
          className={`whitespace-nowrap mx-1.5 font-semibold ${
            complete ? 'text-primary' : 'text-[#B7B7B7]'
          }`}
        >
          {title}
        </span>
      </div>
    </>
  )
}

export const ProgressBar: React.VFC<ProgressBarProps> = ({
  sections,
  estimateSection,
}) => {
  return (
    <div className="flex items-center">
      {sections.map(({ title, complete }, index: number) => (
        <ProgressSection
          key={index}
          title={title}
          complete={complete}
          first={index == 0}
        />
      ))}
      <div
        className={`flex-auto border-t-4 ${
          estimateSection ? 'text-primary' : 'text-[#B7B7B7]'
        }`}
      ></div>
      <ProgressSection
        title="Estimation"
        complete={estimateSection}
        first={false}
      />
    </div>
  )
}

export default ProgressBar

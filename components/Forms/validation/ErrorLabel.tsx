export const ErrorLabel: React.VFC<{ errorMessage: string }> = ({
  errorMessage,
}) => (
  <div
    role="alert"
    className={`border-l-4 border-[#b6070a] opacity-90 px-3 py-1 bg-[#F3E9E8] font-semibold -mt-1 mb-2`}
  >
    {errorMessage}
  </div>
)

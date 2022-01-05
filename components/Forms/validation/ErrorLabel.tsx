export const ErrorLabel: React.VFC<{ errorMessage: string }> = ({
  errorMessage,
}) => (
  <div
    role="alert"
    className={`border-l-4 border-[#b6070a] opacity-90 px-3 py-1 bg-[#F3E9E8] font-bold mb-1.5`}
  >
    {errorMessage}
  </div>
)

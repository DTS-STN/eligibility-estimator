import NextHead from 'next/head'
// import Script from 'next/script'

export const Head: React.VFC<{ title: string }> = ({ title }) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {/* commented out - causing issues with page render */}
      {/*<Script src="https://assets.adobedtm.com/be5dfd287373/0127575cd23a/launch-913b1beddf7a-staging.min.js" />*/}
    </NextHead>
  )
}

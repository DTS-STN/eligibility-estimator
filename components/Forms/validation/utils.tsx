export const sanitizeCurrency = (value, language) => {
  if (value.includes('$'))
    return value
      .toString()
      .replaceAll(' ', '')
      .replace(/(\d+),(\d+) \$/, '$1.$2') // replaces commas with decimals, but only in French!
      .replaceAll(',', language === 'en' ? '' : '.')
      .replaceAll('$', '')
  else return value
}

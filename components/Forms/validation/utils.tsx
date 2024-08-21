export const sanitizeCurrency = (value, language) => {
  console.log('Value being sanitized:', value)
  return value
    .toString()
    .replaceAll(' ', '')
    .replace(/(\d+),(\d+) \$/, language === 'en' ? '' : '$1.$2') // replaces commas with decimals, but only in French!
    .replaceAll(',', language === 'en' ? '' : '.')
    .replaceAll('$', '')
}

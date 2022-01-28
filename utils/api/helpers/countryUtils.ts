import { countryList } from '../definitions/countries'

/**
 * Returns a list of countries with a social agreement.
 */
export const AGREEMENT_COUNTRIES: string[] = countryList.map((item) => {
  if (item.agreement) return item.code
})

/**
 * Returns the full list of accepted country codes.
 */
export const ALL_COUNTRY_CODES: string[] = countryList.map((item) => item.code)

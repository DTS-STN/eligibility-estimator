import { countryList } from '../definitions/countries'
import { LivingCountry } from '../definitions/enums'

/**
 * Normalizes a country to the LivingCountry enum, which is either Canada, Agreement, or No Agreement.
 * @param country Country code as a string
 */
export default function normalizeLivingCountry(country: string): LivingCountry {
  if (country === LivingCountry.CANADA) return LivingCountry.CANADA
  return AGREEMENT_COUNTRIES.includes(country)
    ? LivingCountry.AGREEMENT
    : LivingCountry.NO_AGREEMENT
}

/**
 * Returns a list of countries with a social agreement.
 */
const AGREEMENT_COUNTRIES: string[] = countryList.map((item) => {
  if (item.agreement) return item.code
})

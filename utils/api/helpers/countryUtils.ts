import { countryList } from '../definitions/countries'
import { LivingCountry } from '../definitions/enums'

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
  if (item.agreement) return item.country
})

/**
 * Returns a list of countries, but specifically excludes "Agreement" from the list.
 * We are keeping "Agreement" as a country since it makes testing easier.
 */
export const ALL_COUNTRIES: string[] = countryList.flatMap((item) =>
  item.country === LivingCountry.AGREEMENT ? [] : item.country
)

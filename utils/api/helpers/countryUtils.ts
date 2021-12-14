import { countryList } from '../definitions/countries'
import { LivingCountry } from '../definitions/enums'

export default function normalizeLivingCountry(country: string): LivingCountry {
  if (country === LivingCountry.CANADA) return LivingCountry.CANADA
  return AGREEMENT_COUNTRIES.includes(country)
    ? LivingCountry.AGREEMENT
    : LivingCountry.NO_AGREEMENT
}
const AGREEMENT_COUNTRIES: string[] = countryList.map((item) => {
  if (item.agreement) return item.country
})
export const ALL_COUNTRIES: string[] = countryList.map((item) => item.country)

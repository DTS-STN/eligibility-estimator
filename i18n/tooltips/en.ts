import { FieldKey } from '../../utils/api/definitions/fields'
import apiEn from '../api/en'
import { TooltipTranslations } from './index'

const en: TooltipTranslations = {
  [FieldKey.MARITAL_STATUS]: {
    heading: apiEn.category.marital,
    text: "<p style='padding-bottom: 20px;'><span style='font-weight: bold;'>Common-Law</span>: You have lived continuously with your partner in a marital-type relationship for a minimum of one year.</p> <p style='padding-bottom: 20px;'><span style='font-weight: bold;'>Divorced</span>: You are officially separated and have legally ended your marriage.</p> <p style='padding-bottom: 20px;'><span style='font-weight: bold;'>Married</span>: You and your spouse have had a ceremony that legally binds you to each other. Your marriage must be legally recognized in the country where it was performed and in Canada.</p> <p style='padding-bottom: 20px;'><span style='font-weight: bold;'>Single</span>: You have never been married and are not in a common-law relationship.</p> <p style='padding-bottom: 20px;'><span style='font-weight: bold;'>Surviving Partner/Widowed</span>: Your spouse has died and that you have not remarried or entered into a common-law relationship.</p><p><span style='font-weight: bold;'>Separated:</span> You have been living apart from your spouse or common-law partner because of a breakdown in the relationship for a period of at least 90 days and you have not reconciled.</p>",
  },
  [FieldKey.LEGAL_STATUS]: {
    heading: apiEn.category.legal,
    text: "<p style='padding-bottom: 20px;'><span style='font-weight: bold;'>Canadian citizen:</span> You are Canadian by birth (either born in Canada or born outside Canada to a Canadian citizen who was themselves either born in Canada or granted citizenship) or you have applied for a grant of citizenship and have received Canadian citizenship.</p><p style='padding-bottom: 20px;'><span style='font-weight: bold;'>A permanent resident or landed immigrant (non-sponsored immigrant):</span> You have been given permanent resident status by immigrating to Canada, but is not a Canadian citizen.</p><p style='padding-bottom: 20px;'><span style='font-weight: bold;'>A permanent resident or landed immigrant (sponsored immigrant):</span> You are a foreign national who has applied for permanent residence under the Family Class, has an approved Canadian sponsor, and meets the requirements of the Family Class.</p><p><span style='font-weight: bold;'>Indian status or status card:</span> You are registered as an Indian under the Indian Act.</p>",
  },
  [FieldKey.INCOME]: {
    heading: apiEn.category.income,
    text: '<div style="padding-top:8px;">You can find your net income on line 23600 of your personal income tax return (T1).</div><div style="padding-top:8px;">For a more accurate estimate, remove from this amount: </div> <ul class="list-disc" style="padding-left:12px"><li>any Old Age Security payments</li><li>your first 5,000$ of employment or self-employment income, and 50% of the next $10,000</li></ul>',
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    useDataFromKey: 'legalStatus',
  },
}

export default en

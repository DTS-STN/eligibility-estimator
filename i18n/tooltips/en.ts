import { FieldKey } from '../../utils/api/definitions/fields'
import apiEn from '../api/en'
import { TooltipTranslations } from './index'

const en: TooltipTranslations = {
  [FieldKey.MARITAL_STATUS]: {
    heading: apiEn.category.marital,
    moreinfo: 'Which option applies to me?',
    text: "<p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Single</span>: \
            You have never been married and are not in a common-law relationship. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Divorced</span>: \
            You're officially separated and have legally ended your marriage. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Separated:</span> \
            You have been living apart from your spouse or common-law partner because of a breakdown in the relationship for a period of at least 90 days and you have not reconciled. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Married</span>: \
            You and your spouse have had a ceremony that legally binds you to each other. \
            Your marriage must be legally recognized in the country where it was performed and in Canada. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Common-Law</span>: \
            You have lived continuously with your partner in a marital-type relationship for a minimum of 1&nbsp;year.\
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Widowed</span>: \
            Your spouse or common-law partner has died and you have not remarried or entered into a common-law relationship. \
          </p> \
          ",
  },
  [FieldKey.LEGAL_STATUS]: {
    heading: apiEn.category.legal,
    moreinfo: 'What does it mean to have legal status?',
    text: "<p style='padding-bottom: 12px;'> \
          Having legal status means you're allowed to enter and stay in Canada as: \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 12px; padding-left: 20px;'> \
            <li>a Canadian citizen</li> \
            <li>a temporary resident</li> \
            <li>a permanent resident (landed immigrant)</li> \
            <li>a refugee</li> \
            <li>an Indigenous person registered under the <em>Indian Act</em></li> \
          </ul> \
          ",
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    heading: apiEn.category.legal,
    moreinfo: 'What does it mean to have legal status?',
    text: "<p style='padding-bottom: 12px;'> \
            Having legal status means your partner is allowed to enter and stay in Canada as: \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 12px; padding-left: 20px;'> \
            <li>a Canadian citizen</li> \
            <li>a temporary resident</li> \
            <li>a permanent resident (landed immigrant)</li> \
            <li>a refugee</li> \
            <li>an Indigenous person registered under the <em>Indian Act</em></li> \
          </ul> \
          ",
  },
  [FieldKey.INCOME]: {
    heading: apiEn.category.income,
    moreinfo: 'Where can I find my annual income?',
    text: '<div style="padding-bottom:16px;"><div style="padding-top:8px;">You can find your net income on line&nbsp;23600 of your personal income tax return (T1).</div><div style="padding-top:8px;">Remove from this amount: </div> <ul class="list-disc" style="padding-left: 12px;"><li style="padding-top: 10px;">any Old Age Security payments</li><li style="padding-top: 10px;">your first $5,000 of employment or self-employment income, and 50% of the next $10,000</li></ul></div>',
  },
  [FieldKey.PARTNER_INCOME]: {
    heading: apiEn.category.income,
    moreinfo: 'Where can I find my partner’s annual income?',
    text: '<div style="padding-bottom:16px;"><div style="padding-top:8px;">Your partner’s net income appears on line&nbsp;23600 of their personal income tax return (T1).</div><div style="padding-top:8px;">Remove from this amount: </div> <ul class="list-disc" style="padding-left: 12px;"><li style="padding-top: 10px;">any Old Age Security payments</li><li style="padding-top: 10px;">their first $5,000 of employment or self-employment income, and 50% of the next $10,000</li></ul></div>',
  },
}

export default en

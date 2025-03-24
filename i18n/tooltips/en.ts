import { FieldKey } from '../../utils/api/definitions/fields'
import apiEn from '../api/en'
import { TooltipTranslations } from './index'

const en: TooltipTranslations = {
  [FieldKey.MARITAL_STATUS]: {
    heading: apiEn.category.marital,
    moreinfo: 'Which option applies to you?',
    text: "<dl> \
            <dt>Single:</dt> \
            <dd style='padding-bottom: 12px; margin-left: 24px;'> \
              You have never been married and are not in a common-law relationship. \
            </li> \
            <dt>Divorced:</dt> \
            <dd style='padding-bottom: 12px; margin-left: 24px;'> \
              You're officially separated and have legally ended your marriage. \
            </dd> \
            <dt>Separated:</dt> \
            <dd style='padding-bottom: 12px; margin-left: 24px;'> \
              You have been living apart from your spouse or common-law partner because of a breakdown in the relationship for a period of at least 90 days and you have not reconciled. \
            </dd> \
            <dt>Married:</dt> \
            <dd style='padding-bottom: 12px; margin-left: 24px;'> \
              You and your spouse have had a ceremony that legally binds you to each other. \
              Your marriage must be legally recognized in the country where it was performed and in Canada. \
            </dd> \
            <dt>Common-law:</dt> \
            <dd style='padding-bottom: 12px; margin-left: 24px;'> \
              You have lived continuously with your partner in a marital-type relationship for a minimum of 1&nbsp;year.\
            </dd> \
            <dt>Widowed:</dt> \
            <dd style='padding-bottom: 12px; margin-left: 24px;'> \
              Your spouse or common-law partner has died and you have not remarried or entered into a common-law relationship. \
            </dd> \
          </dl>",
  },
  [FieldKey.LEGAL_STATUS]: {
    heading: apiEn.category.legal,
    moreinfo: 'What does it mean to have legal status?',
    text: "<p style='padding-bottom: 8px;'> \
          Having legal status means you're allowed to enter and stay in Canada as: \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 8px; padding-left: 20px;'> \
            <li>a Canadian citizen</li> \
            <li>an Indigenous person registered under the <em>Indian Act</em></li> \
            <li>a temporary resident</li> \
            <li>a permanent resident (landed immigrant)</li> \
            <li>a refugee</li> \
          </ul> \
          ",
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    heading: apiEn.category.legal,
    moreinfo: 'What does it mean to have legal status?',
    text: "<p style='padding-bottom: 8px;'> \
            Having legal status means your partner is allowed to enter and stay in Canada as: \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 8px; padding-left: 20px;'> \
            <li>a Canadian citizen</li> \
            <li>an Indigenous person registered under the <em>Indian Act</em></li> \
            <li>a temporary resident</li> \
            <li>a permanent resident (landed immigrant)</li> \
            <li>a refugee</li> \
          </ul> \
          ",
  },
  [FieldKey.INCOME]: {
    heading: apiEn.category.income,
    moreinfo: 'Will this income be used in your application?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(51, 51, 51);'> \
            No, this is an estimation. Your actual <a class='hintText' style='text-decoration: underline;' href='https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/apply.html#h2.2-3.1' target='_blank' aria-label='opens a new tab'>income and exemptions</a> will be assessed when you apply. \
            </p> \
          </div> \
          ",
  },
  [FieldKey.INCOME_WORK]: {
    heading: apiEn.category.income,
    moreinfo: 'Why are we asking for your work income?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(51, 51, 51);'> \
            Your first $5,000 of work income is exempt, as well as 50% of the next $10,000. We'll calculate this for you. \
            </p> \
          </div> \
    ",
  },
  [FieldKey.PARTNER_INCOME]: {
    heading: apiEn.category.income,
    moreinfo: 'Will this income be used in your application?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(51, 51, 51);'> \
            No, this is an estimation. Your partner’s actual <a class='hintText' style='text-decoration: underline; display: flex;' href='https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/apply.html#h2.2-3.1' target='_blank' aria-label='opens a new tab'>income and exemptions</a> will be assessed when you apply. \
            </p> \
          </div> \
          ",
  },
  [FieldKey.PARTNER_INCOME_WORK]: {
    heading: apiEn.category.marital,
    moreinfo: 'Why are we asking for their work income?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(51, 51, 51);'> \
            Their first $5,000 of work income is exempt, as well as 50% of the next $10,000. We'll calculate this for you. \
            </p> \
          </div> \
    ",
  },
  [FieldKey.YEARS_IN_CANADA_SINCE_18]: {
    heading: apiEn.category.residence,
    moreinfo: 'When does residence start counting?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(51, 51, 51);'> \
              Residence begins when you reside and make your home in Canada. \
            </p> \
          </div> \
    ",
  },
  [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]: {
    heading: apiEn.category.marital,
    moreinfo: 'When does residence start counting?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(51, 51, 51);'> \
              Residence begins when your partner resides and makes their home in Canada. \
            </p> \
          </div> \
    ",
  },
}

export default en

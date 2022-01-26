/**
 * The OAS entitlement maximum monthly amount.
 * Note that in July 2022, there is a change expected where ages over 75 will receive 10% more. That is not implemented here yet.
 * Source: https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html
 */
export const MAX_OAS_ENTITLEMENT = 642.25
export const OAS_RECOVERY_TAX_CUTOFF = 79054 // not using this yet

/**
 * Income maximums. Updates periodically.
 * Should probably automate pulling from the source.
 * Source: https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html
 */
export const MAX_OAS_INCOME = 133141
export const MAX_GIS_INCOME_SINGLE = 19464
export const MAX_GIS_INCOME_PARTNER_OAS = 25728
export const MAX_GIS_INCOME_PARTNER_ALW = 46656 // same number as below so supposedly fine that it's unused
export const MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW = 46656
export const MAX_ALW_INCOME = 36048
export const MAX_AFS_INCOME = 26256

export default MAX_OAS_ENTITLEMENT

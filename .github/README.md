# Canadian Old Age Benefits Estimator

## Overview

The Canadian Old Age Benefits Estimator (COABE) is a static web app that will take a client's answers to around six questions and determine if they are eligible for any of the four covered benefits:

- [Old Age Security](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html)
- [Guaranteed Income Supplement](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html)
- [Allowance](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance.html)
- [Allowance for the Survivor](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor.html)

If the client is eligible, the tool will also determine the monthly amounts they are entitled to. This logic has been determined using [publicly available data](https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html), in conjunction with internal discussions with policy experts to verify our logic for edge cases.

The intent is that all values provided by the tool are completely accurate. However, certain edge cases are deliberately not handled due to complexity, which results in no estimation results available. As far as we are aware, all provided estimates are fully accurate, however as the government changes limits and policies, COABE's estimates may become inaccurate. Therefore, we emphasize that any data returned by this tool is not final and is subject to inaccuracy.

## License

Canadian Old Age Benefits Estimator is open source and licensed under the GNU General Public license.

# Canadian Old Age Benefits Estimator

## Overview

The Canadian Old Age Benefits Estimator (COABE) is a static web app that will take a client's answers to around six questions and determine if they are eligible for any of the four covered benefits:

- [Old Age Security](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html)
- [Guaranteed Income Supplement](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html)
- [Allowance](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance.html)
- [Allowance for the Survivor](https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor.html)

If the client is eligible, the tool will also determine the monthly amounts they are entitled to. This logic has been determined using [publicly available data](https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html), in conjunction with internal discussions with policy experts to verify our logic for edge cases.

The intent is that all values provided by the tool are completely accurate. However, certain edge cases are deliberately not handled due to complexity, which results in no estimation results available. As far as we are aware, all provided estimates are fully accurate, however as the government changes limits and policies, COABE's estimates may become inaccurate. Therefore, we emphasize that any data returned by this tool is not final and is subject to inaccuracy.

## Development: Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Application Architecture

COABE was initially built with a traditional frontend plus API approach, where the frontend would have as little logic as possible, and offload the processing whenever possible to the backend API. This separation helped easily distinguish the design and layout (frontend) from the benefit processing logic (backend).

Since the benefit processing logic was captured as a complex decision tree, and the API's goal was to capture all benefit logic, the frontend needed to constantly re-render its displayed form fields without any previous knowledge of the form. We wanted to avoid having benefit logic in the frontend for ease of maintenance.

The way we accomplished this was to build a "component factory" responsible for receiving a payload containing all data necessary to build the form, such as the questions, the ordering, the question options, and so on. Whenever the client enters data into the form, a request is sent to the backend, and a complete payload is returned to the frontend for re-rendering based on the new input. This proved to work very well, and was highly responsive despite the frequent network requests.

Ultimately, due to issues with certain intricacies of Next.js Static Site Generation, we changed our approach. Instead of sending an API request, the frontend now calls the API code directly (locally). This still uses the exact same logic, and still separates the code for ease of maintenance, however now there are no network requests made at all. This increased responsiveness even further, and simplified deployment, as now there is only a static site to deploy, and no backend API is necessary.

However, while we removed the frontend's usage of the API, it is still fully functional. You may interact with the API directly via `/api/calculateEligibility`, or you may use a "Swagger UI" to interact with it through `/interact`. A live version of this is available [here](https://canadian-old-age-benefits-estimator.vercel.app/interact).

### Technologies Used

- [Next.js](https://nextjs.org/): Core framework
  - The [Next.js documentation](https://nextjs.org/docs) is extremely valuable in understanding how things work, and is a highly recommended read.
  - See also [Learn Next.js](https://nextjs.org/learn), an interactive Next.js tutorial.
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/): UI framework
- [React testing library](https://testing-library.com/docs/react-testing-library/intro/): React component testing
- [Mobx state tree](https://mobx-state-tree.js.org/intro/welcome): React state management
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/): Unit testing
- [Yarn](https://yarnpkg.com/): Package manager (note this is Yarn v2, and not the classic v1)

### Frontend

#### Additional Details

The payload would then have a key called field data that could be parsed into an array of fields that the component factory would know how to render.

A user enters an answer into the form a payload is sent to the back end, processed, and a new payload is sent back defining the current state of the form.

The component factory currently supports select components, number field components, currency components, radio button components, and a text field component.

Top of a set of fields there is also the concept of child form fields. This is essentially when a form field is tied to the logic of another form field and renders based on a selection that can occur. For example, there are questions that require partner information and only render when the user is in a common law or marriage relationship.

#### Technology

Because of React's form issues, `mobx-state-tree` and `mobx-react` were used to only re-render when necessary and to control the current state of user inputted data what component's are currently rendered on screen.

You may come across `observer` components, which will observe to the mobx data in the form and only re-render a component if it needs to instead of React's default re-rendering scheme where the parent and all children are automatically re-rendered.

#### File Structure

Below you'll find the file structure as it pertains to the front end.

- `/pages` - Next.js pages, including the API. The structure here determines routing.
- `/client-state` - state management lives here, all mobx tree node files
- `/components` - where all the react components live
- `/public` - any asset or file that needs to be accessible by the application must go here
- `/styles`
- `/__tests__`

### Backend

#### Interacting with the API

Despite the frontend calling the backend code directly and not through an API, the API still exists and is fully functional. You may interact with the API directly via `/api/calculateEligibility`, or you may use a "Swagger UI" to interact with it through `/interact`. A live version of this is available [here](https://canadian-old-age-benefits-estimator.vercel.app/interact). You may also use [Insomnia](https://insomnia.rest/), an open source API client, to interact with the API. If you are using Insomnia, you should import `public/insomnia.yaml` to get set up quickly.

#### Scraping government data

COABE depends on several pieces of occasionally-changing data from [Canada.ca](https://canada.ca). Rather than requiring developers to copy-paste whenever it changes (it changes quarterly), there is a "scraper" built to automate this process. Simply use `yarn run run-scraper` to pull all necessary "legal values" from the available government sources.

Note that this is prone to breaking, for example if the scraped website changes its layout. In this case you would have to update the "selector" under `/utils/api/scrapers` to match the new layout, and run the script again.

Unfortunately this scraping should not be fully automated due to the possibility of errors as mentioned above. Any updates require manual review to ensure the scraper is working as intended. That being said, manual review is pretty straightforward, if the numbers are way different or don't exist, there is a problem. Otherwise, it should work as expected.

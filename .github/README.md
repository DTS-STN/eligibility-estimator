## Description

Quick starter template for DTS projects making use of one of our commonly-used [Next.js](https://nextjs.org/) setups.
This template uses the basic Next.js [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) bootstrap template.

### Technologies Implemented

This project uses

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/) for unit testing
- [Cypress](https://www.cypress.io/) for end-to-end testing.

## How to Implement/Get Started

### Values that need to be configured:

#### Replace next-template name to new project name

Search "next-template", replace in package.json, run "npm i" in terminal and confirm package-lock.json is updated

#### Configuring Helm

In the helm template, the application name is single-tier-application. this will need to be changed by the current application name.

For every Kubernetes cluster, a context.sh file needs to be defined. For example, one might be called context-dev.sh and the other context-prod.sh.

For more information, please visit the [DTS SRE deployment templates](https://github.com/DTS-STN/dts-sre-deployment-templates/tree/main/kubernetes-helm-template).

## Deployments

Write something about how deployments are done

## PR Procedures/Definition of done

We need to have at least one person reviewing each PR before it can be merged. Also, each branch should be prefixed by the relevant Jira issue, if possible e.g. **DC-13**-comprehensive-readme

## Useful Links

[TeamCity Link](https://teamcity.dts-stn.com/)

--- Default Create Next App text: remove or keep or re-use at your discretion ---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

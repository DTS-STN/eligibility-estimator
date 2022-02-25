## Description

### Technologies Implemented

This project uses

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jest](https://jestjs.io/) for unit testing
- [React testing library](https://testing-library.com/docs/react-testing-library/intro/) for easy component testing.
- [Mobx state tree](https://mobx-state-tree.js.org/intro/welcome) for state management.

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

## Frontend

### Approach

Because the user experience was captured as a decision tree the front end needed to, at any point, render a specific form field / form layout without any previous knowledge of the form. The way we accomplish this was to build a component factory that was responsible for receiving a payload that followed a very specific interface and render components based on some payload data.

The payload would then have a key called field data that could be parsed into an array of fields that the component factory would know how to render.

A user enters an answer into the form a payload is sent to the back end, processed, and a new payload is sent back defining the current state of the form.

The component factory currently supports select components, number field components, currency components, radio button components, and a text field component.

Top of a set of fields there is also the concept of child form fields. This is essentially when a form field is tied to the logic of another form field and renders based on a selection that can occur.

For example, there are partner detail questions that only render when the user is in a common law or marriage relationship.

### Technology

Because of react's form issues, mobx-state-tree and mobx-react were used to only re-render when necessary and to control the current state of user inputted data what component's are currently rendered on screen.

You may come across `observer` components, which will observe to the mobx data in the form and only re-render a component if it needs to instead of react's default re-rendering scheme where the parent and all children are automatically re-rendered.

## Backend

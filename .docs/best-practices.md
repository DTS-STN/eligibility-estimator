# Best Practices

## Application repository and contributions

- The application's code repository is hosted on GitHub.
- Any changes to the application are made in their own branch within GitHub.
- Any commits must be signed by the developer. This ensures all contributions are completed by whom the developer claims they are.
- Once the changes are ready for review, a Pull Request (PR) is opened by the developer for review.
- All PRs require code review, and can not be merged until at least one approval is provided from another developer.
- Once the PR is approved, it should be merged into the `develop` branch.
  - In general, a `squash` merge is preferred, in order to keep a clean commit history.
- Once the merge into `develop` is completed, this will trigger a deployment to our dev site, which we use regularly for testing/review.
- Once the change is live on the dev site, it will be tested/reviewed for some time. Once the team is happy with the current state of the dev site, a release to production can be initiated. This is done by merging the `develop` branch into the `main` branch.
  - By only making changes to the `main` branch through the `develop` branch, we can ensure any changes to production have gone through code review and testing.
- In GitHub, the `main` and `develop` branches are "protected branches", which limits destructive changes. For example, this blocks force pushes, branch deletion, and merging/committing without an approved PR.

## Dependencies

- We are using GitHub’s built-in Dependabot for dependency security analysis. This continuously reviews the dependencies used by our project for security issues, and if issues are found, they are displayed "front and center" in the GitHub repository page, for developer review.
- We have no defined schedule for completing dependency updates, though as alerts are raised, we are able to go in and update all dependencies at that time.

## Code checks

- We have a number of tests/checks/fixes that run automatically, ensuring code quality:
  - ESLint: runs automatically on commit locally (?), and automatically on PRs/deployment through GitHub
    - This covers dozens/hundreds of common issues, validates best practices, and so on.
  - Prettier: runs automatically on commit locally
    - This automatically formats all changes code, ensuring consistent syntax.
  - CodeQL: runs automatically on PRs/deployment
    - This runs a number of deep code quality checks, and validates best practices.
    - For example, it caught us using .replace() rather than .replaceAll() – the former only replaces the first instance, which was a problem because we wanted to remove all commas from the string rather than only the first one.
  - Automated tests: this is run manually by the developer in their local environment, as well as automatically on PRs/deployment
    - Tests written by us covering frontend rendering as well as logic/processing/output
  - Any failures in the above checks will block merging/deployment until resolved.

## Application security

- All user input is immediately sanitized by using Joi ensuring all data meets our expectations before proceeding
- All data processing is local, at no point will anything ever leave the user’s local machine or come from any remote service (it’s a fully local web app)
- There is Adobe Analytics for client-side interaction tracking, though the data it captures is quite limited (user-interaction data only, no user-inputs are captured)

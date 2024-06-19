# Andromeda Development Standards

## Creating an Issue

1. In the `Issues` section of the repository, click the `Add` button.
2. Provide a clear and concise description of the issue.
3. Select the appropriate label(s) for categorization.
4. Link the issue to the relevant `Project` by pressing the `Project` button within the issue.

## Development Process

- When starting to work on an issue, click `Create Branch` to automatically link the issue to a branch.
- If you forget to create a branch linked to the issue, you can still link the branch by navigating back to the issue and pressing `Link PR` when you submit your Pull Request (PR).

**Note:** Linking PRs to issues is crucial for tracking progress. If the PR is linked, the issue will automatically be moved to `Done` upon closing.

## Branches

- For all issues, features, and new code, **please create a new branch** for your work.
- Use meaningful branch names that relate to the issue or feature (e.g., `feature/user-auth`, `bugfix/login-issue`).

## Pull Requests

- PR reviews will become increasingly important as we move forward. Initially, when things are hectic, it may be challenging to focus on reviews.
- Soon, every PR should be reviewed by a Subject Matter Expert (SME) in the relevant area before being merged to `main`.
- Provide a clear description of the changes made and the purpose of the PR.

## TypeScript Syntax

- Ensure consistent use of TypeScript-specific features like types, interfaces, and generics.
- Let's decide on a common formatter that we all can use (such as prettier)

## Python Syntax

- Use the `black` formatter for consistent code formatting.

## Frontend Development Process

- Testing the frontend locally is straightforward. Run the development server and test your changes in the browser.
- Vercel auto-deploys a preview for non-production branches. Currently, I believe only the account holder can see these previews, and it costs $20+ to add additional users to the account.
- I am thinking about a solution to provide broader access to these previews.
- Previews are useful because they allow testing changes without needing to switch branches and run locally.

## Backend Development Process

- Our goal is to develop a setup where:
  - We do not perform development directly on the production server.
  - Using docker, we can run the entire backend Flask app and PostgreSQL database locally using Docker, allowing everyone to test backend changes individually before updating the server.

**Benefits of local backend dev:**

1. More team members can work on backend tasks simultaneously.
2. We can test API changes without risking downtime or disruptions to the live API.
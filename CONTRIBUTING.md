# Contributing to Surferhead

Surferhead would not be possible without active support from the community. We appreciate and encourage your contributions, no matter how big or small.

Review our contribution guidelines:

* [Code of Conduct](#code-of-conduct)
* [Reporting a Problem](#reporting-a-problem)
* [Code Contribution](#code-contribution)

## Code of Conduct

Surferhead abides by the [Contributor Code of Conduct](CODE_OF_CONDUCT.md).

## Reporting a Problem

If you encounter a bug with Surferhead, please file an issue in the [GitHub repository](https://github.com/SurfSkipTech/surferhead/issues).
Search through the existing issues to see if the problem has already been reported or addressed.

When you create a new issue, the template text is automatically added to its body. You should complete all sections in this template to help us understand the issue. Missing information could delay the processing time.

## Code Contribution

Follow the steps below when submitting your code.

1. Search the [list of issues](https://github.com/SurfSkipTech/surferhead/issues) to see if there is an issue for the bug or feature you are going to work on or create a new one.

2. To address an already described issue, check the comment thread to make sure that no one is working on it at the moment. Leave a comment saying that you are willing to fix this issue, and include details on how you plan to do this. Core team members may need to discuss the details of the proposed fix with you. After they have approved it, leave a comment saying that you started your work on this issue.

3. Install [Node.js](https://nodejs.org/) on your development machine.

4. Fork Surferhead and create a branch in your fork. Name this branch with an issue number, for example, `gh852`, `gh853`.
  
5. Install dependencies using [pnpm](https://pnpm.io) (can be installed with npm, `npm install --global pnpm`). In the root directory of your local copy, run:

    ```sh
    pnpm install
    ```

6. Fetch upstream changes and rebase your branch onto `master`.

7. Push changes to your fork and open a pull request.

Before you submit your pull request, it has to satisfy the following conditions:

* The pull request name should describe the changes you implemented
* The pull request description should contain the [closes](https://github.com/blog/1506-closing-issues-via-pull-requests) directive with an appropriate issue number

## Build Instructions

```sh
pnpm build
```

# How to contribute

We love pull requests. And following this guidelines will make your pull request easier to merge.

If you want to contribute but don’t know what to do, take a look at these two labels:
[help wanted](https://github.com/ska-kialo/eslint-plugin-unnecessary-filename-in-import/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) and
[good first issue](https://github.com/ska-kialo/eslint-plugin-unnecessary-filename-in-import/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

_[Use GitHub interface](https://blog.sapegin.me/all/open-source-for-everyone/) for simple documentation changes, otherwise follow the steps below._

## Prerequisites

- Fork the repository and clone your fork.
- Install dependencies: `yarn`.

## Development workflow

Run linters and tests:

```bash
yarn lint
yarn test
```

**Don’t forget to add tests and update documentation for your changes.**

**Please commit the updated yarn lock file (`yarn.lock`) if you add or update dependencies.**

## Other notes

- Remember to compile and commit the compiled JavaScript in `lib/`. 
- If you have commit access to repository and want to make big change or not sure about something, make a new branch and open pull request.
- We’re using [Prettier](https://github.com/prettier/prettier) to format code, so don’t worry much about code formatting.
- Don’t change version number and changelog.

## Need help?

If you want to contribute but have any questions, concerns or doubts, feel free to ping maintainers. Ideally create a pull request with `WIP` (Work in progress) in its title and ask questions in the pull request description.

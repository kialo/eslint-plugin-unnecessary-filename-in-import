# eslint-plugin-unnecessary-filename-in-import

ESLint rule to require import statements to only reference the directory of a module
instead of the file if the name of the module and the file are the same.
This is useful when each module has a `package.json` with "main" set to the modules main file.

Some IDEs do not recognize the existence of the `package.json` and create import statements with the filename.

You can provide the option `{ "skipPackageJsonCheck": true }` to not read each
potentially violating import's `package.json` to check if it matches the use case.
This means you are certain that every package that has a source file with the same name as the package
also has a package.json with "main" set to that file.

<!-- TODO: ## Sample -->

## Installation

```bash
yarn add -D eslint-plugin-unnecessary-filename-in-import
```

Then, in your `.eslintrc.json`:

```json
{
    "plugins": ["unnecessary-filename-in-import"],
    "rules": {
        "unnecessary-filename-in-import/rule": "error"
    }
}
```

## Changelog

The changelog can be found on the [Releases page](https://github.com/kialo/eslint-plugin-unnecessary-filename-in-import/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Kialo GmbH](https://www.github.com/kialo) and [contributors](https://github.com/kialo/eslint-plugin-unnecessary-filename-in-import/graphs/contributors).

MIT License, see the included [License.md](License.md) file.

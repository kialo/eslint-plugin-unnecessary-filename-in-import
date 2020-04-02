import * as fs from 'fs';
import testRule, { errorMessage } from './test-rule';

describe('without-package-json', () => {
    beforeEach(() => {
        jest.spyOn(fs, 'existsSync').mockImplementation(() => {
            return false;
        });
    });

    describe('with checking package.json', () => {
        // None of these fail, since there are no package.json files
        testRule({
            valid: [
                {
                    code: `import DefaultImport from './some-module';`,
                },
                {
                    code: `import { something } from './MyModule';`,
                },
                {
                    code: `import { no } from 'lodash'`,
                },
                {
                    code: `import DefaultImport from "./some-module";`,
                },
                {
                    code: `import { something } from "./MyModule";`,
                },
                {
                    code: `import { no } from "lodash"`,
                },
                {
                    code: `import DefaultImport from './some-module/some-module';`,
                },
                {
                    code: `import { something } from './MyModule/MyModule';`,
                },
                {
                    code: `import DefaultImport from "./some-module/some-module";`,
                },
                {
                    code: `import { something } from "./MyModule/MyModule";`,
                },
            ],
            invalid: [],
        });
    });

    describe('without checking package.json', () => {
        testRule({
            valid: [
                {
                    code: `import DefaultImport from './some-module';`,
                    options: [{ skipPackageJsonCheck: true }],
                },
                {
                    code: `import { something } from './MyModule';`,
                    options: [{ skipPackageJsonCheck: true }],
                },
                {
                    code: `import DefaultImport from "./some-module";`,
                    options: [{ skipPackageJsonCheck: true }],
                },
                {
                    code: `import DefaultImport from "./some-module/some-file";`,
                    options: [{ skipPackageJsonCheck: true }],
                },
            ],
            invalid: [
                {
                    code: `import DefaultImport from './some-module/some-module';`,
                    options: [{ skipPackageJsonCheck: true }],
                    errors: [{ message: errorMessage }],
                },
                {
                    code: `import { something } from './MyModule/MyModule';`,
                    options: [{ skipPackageJsonCheck: true }],
                    errors: [{ message: errorMessage }],
                },
                {
                    code: `import DefaultImport from "./some-module/some-module";`,
                    options: [{ skipPackageJsonCheck: true }],
                    errors: [{ message: errorMessage }],
                },
                {
                    code: `import { something } from "./MyModule/MyModule";`,
                    options: [{ skipPackageJsonCheck: true }],
                    errors: [{ message: errorMessage }],
                },
            ],
        });
    });
});

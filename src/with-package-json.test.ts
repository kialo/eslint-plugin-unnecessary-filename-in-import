import * as fs from 'fs';
import testRule, { errorMessage } from './test-rule';

const PACKAGE_REGEXES = {
    NO_PACKAGE_JSON: /\/no-package-json\/package\.json$/,
    NON_MATCHING_PACKAGE_JSON: /\/non-matching-package-json\/package\.json$/,
    MATCHING_PACKAGE_JSON: /\/matching-package-json\/package\.json$/,
};

describe('with-package-json', () => {
    beforeEach(() => {
        const existsSync = fs.existsSync;
        const readFileSync = fs.readFileSync;

        jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
            if (PACKAGE_REGEXES.NO_PACKAGE_JSON.exec(path.toString())) {
                return false;
            } else if (
                PACKAGE_REGEXES.NON_MATCHING_PACKAGE_JSON.exec(path.toString()) ||
                PACKAGE_REGEXES.MATCHING_PACKAGE_JSON.exec(path.toString())
            ) {
                return true;
            }

            return existsSync(path);
        });

        jest.spyOn(fs, 'readFileSync').mockImplementation((...args: Parameters<typeof readFileSync>) => {
            if (PACKAGE_REGEXES.NON_MATCHING_PACKAGE_JSON.exec(args[0].toString())) {
                return JSON.stringify({ main: 'some-other-file.js' });
            } else if (PACKAGE_REGEXES.MATCHING_PACKAGE_JSON.exec(args[0].toString())) {
                return JSON.stringify({ main: 'matching-package-json.js' });
            }

            return readFileSync(...args);
        });
    });

    testRule({
        valid: [
            {
                code: `import DefaultImport from './no-package-json/no-package-json';`,
            },
            {
                code: `import { something } from './non-matching-package-json/non-matching-package-json';`,
            },
        ],
        invalid: [
            {
                code: `import DefaultImport from './matching-package-json/matching-package-json';`,
                output: `import DefaultImport from './matching-package-json';`,
                errors: [{ message: errorMessage }],
            },
        ],
    });
});

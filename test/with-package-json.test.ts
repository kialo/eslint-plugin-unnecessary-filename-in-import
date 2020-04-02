import * as fs from 'fs';
import testRule, { errorMessage } from './test-rule';

describe('with-package-json', () => {
    beforeEach(() => {
        jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
            if (/\/no-package-json\/package\.json$/.exec(path.toString())) {
                return false;
            }

            return true;
        });

        jest.spyOn(fs, 'readFileSync').mockImplementation((path) => {
            if (/\/non-matching-package-json\/package\.json$/.exec(path.toString())) {
                return JSON.stringify({ main: 'some-other-file.js' });
            } else if (/\/matching-package-json\/package\.json$/.exec(path.toString())) {
                return JSON.stringify({ main: 'matching-package-json.js' });
            }

            throw new Error('Tried to read unexpected file in test: ' + path);
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
                errors: [{ message: errorMessage }],
            },
        ],
    });
});

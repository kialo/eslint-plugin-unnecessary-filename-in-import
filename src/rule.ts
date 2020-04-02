import { Rule as RuleNS } from 'eslint';
import { ImportDeclaration, Literal, Node } from 'estree';
import * as fs from 'fs';
import * as path from 'path';

interface ModuleSpecifierMatch {
    importSource: Literal;
    fixedImportSource: string;
    importDir: string;
    importFilename: string;
}

const UNNECESSARY_FILENAME_REGEX = /^(.*\/([^/]+))\/\2$/;
const OPTION_SKIP_PACKAGE_JSON_CHECK = 'skipPackageJsonCheck';

const DESCRIPTION = `Requires import statements to only reference the directory of a module
instead of the file if the name of the module and the file are the same.
This is useful when each module has a package.json with "main" set to the modules main file.

Some IDEs do not recognize the existence of the package.json and create import statements with the filename.

You can provide the option \`{ "${OPTION_SKIP_PACKAGE_JSON_CHECK}": true }\` to not read each
potentially violating import's package.json to check if it matches the use case.
This means you are certain that every package that has a source file with the same name as the package
also has a package.json with "main" set to that file.`;

/**
 * In import statements like the following, the name of the file (here "DisplayError")
 * is unnecessary, since the file's folder has a package.json with `"main": "DisplayError.ts"`.
 * Some IDEs create statements like this one when auto-importing modules.
 * This rule recognises this import pattern and fixes it.
 *
 *     import DisplayError from '../../error/DisplayError/DisplayError';
 *     // is changed to
 *     import DisplayError from '../../error/DisplayError';
 */
const Rule: RuleNS.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: DESCRIPTION,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    [OPTION_SKIP_PACKAGE_JSON_CHECK]: {
                        type: 'boolean',
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0];
        const skipPackageJsonCheck = options?.[OPTION_SKIP_PACKAGE_JSON_CHECK] ?? false;

        return {
            ImportDeclaration(node: Node): void {
                const match = getModuleSpecifierMatch(node as ImportDeclaration);
                if (match) {
                    if (skipPackageJsonCheck || packageJsonMatches(context, match)) {
                        context.report({
                            message: 'Import statement contains unnecessary filename.',
                            node,
                            fix(fixer) {
                                return fixer.replaceText(match.importSource, match.fixedImportSource);
                            },
                        });
                    }
                }
            },
        };
    },
};

function getModuleSpecifierMatch(node: ImportDeclaration): ModuleSpecifierMatch | undefined {
    const importSource = node.source;
    const moduleSpecifierString = importSource.value;

    if (!moduleSpecifierString || typeof moduleSpecifierString !== 'string') {
        return;
    }

    const match = UNNECESSARY_FILENAME_REGEX.exec(moduleSpecifierString);
    if (match) {
        return {
            importSource,
            fixedImportSource: `'${match[1]}'`, // quote style is not important
            importDir: match[1],
            importFilename: match[2],
        };
    }
}

/**
 * Check if there is a package.json and the filename at the end of the import
 * is the same that the package's "main" key points to.
 *
 * If so we can safely remove the filename from the module path in the import.
 */
function packageJsonMatches(context: RuleNS.RuleContext, { importFilename, importDir }: ModuleSpecifierMatch): boolean {
    // Get the package.json for the import
    const file = context.getFilename();
    const packageFile = path.resolve(path.dirname(file), importDir, 'package.json');

    if (!fs.existsSync(packageFile)) {
        return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageFile, { encoding: 'utf-8' }));
    return packageJson.main.replace(/\.(j|t)sx?$/, '') === importFilename;
}

export default Rule;

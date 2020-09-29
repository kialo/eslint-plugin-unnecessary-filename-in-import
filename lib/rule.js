"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
const Rule = {
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
        var _a;
        const options = context.options[0];
        const skipPackageJsonCheck = (_a = options === null || options === void 0 ? void 0 : options[OPTION_SKIP_PACKAGE_JSON_CHECK]) !== null && _a !== void 0 ? _a : false;
        return {
            ImportDeclaration(node) {
                const match = getModuleSpecifierMatch(node);
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
function getModuleSpecifierMatch(node) {
    const importSource = node.source;
    const moduleSpecifierString = importSource.value;
    if (!moduleSpecifierString || typeof moduleSpecifierString !== 'string') {
        return;
    }
    const match = UNNECESSARY_FILENAME_REGEX.exec(moduleSpecifierString);
    if (match) {
        return {
            importSource,
            fixedImportSource: `'${match[1]}'`,
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
function packageJsonMatches(context, { importFilename, importDir }) {
    var _a;
    // Get the package.json for the import
    const file = context.getFilename();
    const packageFile = path.resolve(path.dirname(file), importDir, 'package.json');
    if (!fs.existsSync(packageFile)) {
        return false;
    }
    const packageJson = JSON.parse(fs.readFileSync(packageFile, { encoding: 'utf-8' }));
    return ((_a = packageJson.main) === null || _a === void 0 ? void 0 : _a.replace(/\.(j|t)sx?$/, '')) === importFilename;
}
exports.default = Rule;

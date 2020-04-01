import { Rule as RuleNS } from 'eslint';
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
declare const Rule: RuleNS.RuleModule;
export default Rule;

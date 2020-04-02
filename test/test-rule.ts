import { RuleTester } from 'eslint';
import Rule from '../src/rule';

export const errorMessage = 'Import statement contains unnecessary filename.';

export default function testRule(testCases: Parameters<RuleTester['run']>[2]): void {
    const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015, sourceType: 'module' } });
    ruleTester.run('eslint-plugin-unnecessary-filename-in-import/rule', Rule, testCases);
}

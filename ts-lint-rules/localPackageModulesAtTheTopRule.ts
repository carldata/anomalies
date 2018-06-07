import * as _ from 'lodash';
import * as Lint from 'tslint';
import { isImportDeclaration, isLiteralExpression } from 'tsutils';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  /* tslint:disable:object-literal-sort-keys */
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'local-package-modules-at-the-top',
    description: Lint.Utils.dedent`
      Local packages i.e. modules managed by npm and saved locally to node_modules folder
      (like lodash or datefns) should be placed at the top.`,
    rationale: Lint.Utils.dedent`
      It is much easier to see at the first glance what npm are used and/or necessary`,
    optionsDescription: 'Not configurable',
    options: null,
    optionExamples: [true],
    type: 'maintainability',
    typescriptOnly: false,
  };

  public static FAILURE_STRING(module: string) {
    return `'${module}' local package module import should be placed at the top of a source file`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

/**
 * Returns true if a imported module name is a local npm package import like 'lodash' or 'date-fns'
 * @param name module name
 */
export function isLocalPackageModuleImport(name: string): boolean {
  return !_.startsWith(name, '.');
}

function walk(ctx: Lint.WalkContext<void>, reportErrors: boolean = true): boolean {
  let result = true;
  let relativeImportFound: boolean = false;
  for (const statement of ctx.sourceFile.statements) {
    if (isImportDeclaration(statement) && isLiteralExpression(statement.moduleSpecifier)) {
      const { text } = statement.moduleSpecifier;
      if (isLocalPackageModuleImport(text)) {
        if (relativeImportFound) {
          if (reportErrors) {
            ctx.addFailureAtNode(statement, Rule.FAILURE_STRING(text));
          }
          result = false;
        }
      } else {
        relativeImportFound = true;
      }
    }
  }
  return result;
}

export const localPackageModulesAtTheTopRuleWalk = walk;
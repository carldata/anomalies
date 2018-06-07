import * as Lint from 'tslint';
import * as _ from 'lodash';
import { isImportDeclaration, isLiteralExpression, isModuleDeclaration } from 'tsutils';
import * as ts from 'typescript';
import { localPackageModulesAtTheTopRuleWalk, isLocalPackageModuleImport } from './localPackageModulesAtTheTopRule';

interface IModuleImport {
  /**
   * Imported module name
   */
  name: string;
  statement: ts.ImportDeclaration;
}

export class Rule extends Lint.Rules.AbstractRule {
  /* tslint:disable:object-literal-sort-keys */
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'local-package-modules-sorted-alphabetically',
    description: Lint.Utils.dedent`
      Local packages i.e. modules managed by npm and saved locally to node_modules folder
      (like lodash or datefns) should be placed at the top and sorted alphabetically.`,
    rationale: Lint.Utils.dedent`
      It is easier at the first glance to see what npm are used and/or necessary.`,
    optionsDescription: 'Not configurable',
    options: null,
    optionExamples: [true],
    type: 'maintainability',
    typescriptOnly: false,
  };

  public static FAILURE_STRING(module: string) {
    return `'${module}' local package module should be imported in an alphabetical order (relative to other module imports)`;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>): void {
  // this rule is ineffective if local-package-modules-at-the-top rule is not met
  if (!localPackageModulesAtTheTopRuleWalk(ctx, false)) {
    return;
  }

  const localPackageImports: IModuleImport[] = [];
  for (const statement of ctx.sourceFile.statements) {
    if (isImportDeclaration(statement) && isLiteralExpression(statement.moduleSpecifier)) {
      const { text } = statement.moduleSpecifier;
      if (isLocalPackageModuleImport(text)) {
        localPackageImports.push({
          name: text,
          statement,
        } as IModuleImport);
      }
    }
  }

  for (const lpi of localPackageImports) {
    const sortedIndex = _.sortedIndexBy(localPackageImports, lpi, (e) => e.name);
    if (sortedIndex !== _.indexOf(localPackageImports, lpi)) {
      ctx.addFailureAtNode(lpi.statement, Rule.FAILURE_STRING(lpi.name));
    }
  }
}


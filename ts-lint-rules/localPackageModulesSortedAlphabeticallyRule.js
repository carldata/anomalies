"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
var Lint = require("tslint");
var _ = require("lodash");
var tsutils_1 = require("tsutils");
var localPackageModulesAtTheTopRule_1 = require("./localPackageModulesAtTheTopRule");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING = function (module) {
        return "'" + module + "' local package module should be imported in an alphabetical order (relative to other module imports)";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: 'local-package-modules-sorted-alphabetically',
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      Local packages i.e. modules managed by npm and saved locally to node_modules folder\n      (like lodash or datefns) should be placed at the top and sorted alphabetically."], ["\n      Local packages i.e. modules managed by npm and saved locally to node_modules folder\n      (like lodash or datefns) should be placed at the top and sorted alphabetically."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      It is easier at the first glance to see what npm are used and/or necessary."], ["\n      It is easier at the first glance to see what npm are used and/or necessary."]))),
        optionsDescription: 'Not configurable',
        options: null,
        optionExamples: [true],
        type: 'maintainability',
        typescriptOnly: false
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    // this rule is ineffective if local-package-modules-at-the-top rule is not met
    if (!localPackageModulesAtTheTopRule_1.localPackageModulesAtTheTopRuleWalk(ctx, false)) {
        return;
    }
    var localPackageImports = [];
    for (var _i = 0, _a = ctx.sourceFile.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (tsutils_1.isImportDeclaration(statement) && tsutils_1.isLiteralExpression(statement.moduleSpecifier)) {
            var text = statement.moduleSpecifier.text;
            if (localPackageModulesAtTheTopRule_1.isLocalPackageModuleImport(text)) {
                localPackageImports.push({
                    name: text,
                    statement: statement
                });
            }
        }
    }
    for (var _b = 0, localPackageImports_1 = localPackageImports; _b < localPackageImports_1.length; _b++) {
        var lpi = localPackageImports_1[_b];
        var sortedIndex = _.sortedIndexBy(localPackageImports, lpi, function (e) { return e.name; });
        if (sortedIndex !== _.indexOf(localPackageImports, lpi)) {
            ctx.addFailureAtNode(lpi.statement, Rule.FAILURE_STRING(lpi.name));
        }
    }
}
var templateObject_1, templateObject_2;

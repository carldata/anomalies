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
var _ = require("lodash");
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.FAILURE_STRING = function (module) {
        return "'" + module + "' local package module import should be placed at the top of a source file";
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    /* tslint:disable:object-literal-sort-keys */
    Rule.metadata = {
        ruleName: 'local-package-modules-at-the-top',
        description: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      Local packages i.e. modules managed by npm and saved locally to node_modules folder\n      (like lodash or datefns) should be placed at the top."], ["\n      Local packages i.e. modules managed by npm and saved locally to node_modules folder\n      (like lodash or datefns) should be placed at the top."]))),
        rationale: Lint.Utils.dedent(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      It is much easier to see at the first glance what npm are used and/or necessary"], ["\n      It is much easier to see at the first glance what npm are used and/or necessary"]))),
        optionsDescription: 'Not configurable',
        options: null,
        optionExamples: [true],
        type: 'maintainability',
        typescriptOnly: false
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
/**
 * Returns true if a imported module name is a local npm package import like 'lodash' or 'date-fns'
 * @param name module name
 */
function isLocalPackageModuleImport(name) {
    return !_.startsWith(name, '.') &&
        !_.startsWith(name, '@');
}
exports.isLocalPackageModuleImport = isLocalPackageModuleImport;
function walk(ctx, reportErrors) {
    if (reportErrors === void 0) { reportErrors = true; }
    var result = true;
    var relativeImportFound = false;
    for (var _i = 0, _a = ctx.sourceFile.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (tsutils_1.isImportDeclaration(statement) && tsutils_1.isLiteralExpression(statement.moduleSpecifier)) {
            var text = statement.moduleSpecifier.text;
            if (isLocalPackageModuleImport(text)) {
                if (relativeImportFound) {
                    if (reportErrors) {
                        ctx.addFailureAtNode(statement, Rule.FAILURE_STRING(text));
                    }
                    result = false;
                }
            }
            else {
                relativeImportFound = true;
            }
        }
    }
    return result;
}
exports.localPackageModulesAtTheTopRuleWalk = walk;
var templateObject_1, templateObject_2;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
exports.OPERATOR_TO_ALIAS_MAP = {
    '=': ['equals', 'eq'],
    '<>': 'ne',
    '<=': 'lte',
    '<': 'lt',
    '>=': 'gte',
    '>': 'gt',
    attribute_not_exists: ['attributeNotExists', 'null'],
    attribute_exists: ['attributeExists', 'notNull'],
    attribute_type: 'type',
    contains: 'contains',
    not_contains: 'notContains',
    IN: 'in',
    begins_with: 'beginsWith',
    BETWEEN: 'between',
};
//# sourceMappingURL=condition-operator-to-alias-map.const.js.map
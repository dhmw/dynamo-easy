"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module expression
 */
const update_action_def_1 = require("./update-action-def");
/**
 * @hidden
 */
exports.UPDATE_ACTION_DEFS = [
    // SET
    new update_action_def_1.UpdateActionDef('SET', 'incrementBy'),
    new update_action_def_1.UpdateActionDef('SET', 'decrementBy'),
    new update_action_def_1.UpdateActionDef('SET', 'set'),
    new update_action_def_1.UpdateActionDef('SET', 'appendToList'),
    // REMOVE
    new update_action_def_1.UpdateActionDef('REMOVE', 'remove'),
    new update_action_def_1.UpdateActionDef('REMOVE', 'removeFromListAt'),
    // ADD
    new update_action_def_1.UpdateActionDef('ADD', 'add'),
    // DELETE
    new update_action_def_1.UpdateActionDef('DELETE', 'removeFromSet'),
];
//# sourceMappingURL=update-action-defs.const.js.map
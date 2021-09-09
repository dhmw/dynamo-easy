/**
 * @module expression
 */
import { UpdateActionKeyword } from './update-action-keyword.type';
import { UpdateAction } from './update-action.type';
export declare class UpdateActionDef {
    actionKeyword: UpdateActionKeyword;
    action: UpdateAction;
    constructor(actionKeyword: UpdateActionKeyword, action: UpdateAction);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * @module decorators
 */
// collection
tslib_1.__exportStar(require("./collection/collection-property.decorator"), exports);
// date
tslib_1.__exportStar(require("./date/date-property.decorator"), exports);
tslib_1.__exportStar(require("./index/gsi-partition-key.decorator"), exports);
tslib_1.__exportStar(require("./index/gsi-sort-key.decorator"), exports);
tslib_1.__exportStar(require("./index/lsi-sort-key.decorator"), exports);
tslib_1.__exportStar(require("./index/index-type.enum"), exports);
// key
tslib_1.__exportStar(require("./key/partition-key.decorator"), exports);
tslib_1.__exportStar(require("./key/sort-key.decorator"), exports);
// model
tslib_1.__exportStar(require("./model/model.decorator"), exports);
// property
tslib_1.__exportStar(require("./property/property.decorator"), exports);
// transient
tslib_1.__exportStar(require("./transient/transient.decorator"), exports);
//# sourceMappingURL=public-api.js.map
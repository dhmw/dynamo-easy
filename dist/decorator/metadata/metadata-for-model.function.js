"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("./metadata");
/**
 * create the metadata wrapper instance for a @Model() decorated class.
 */
function metadataForModel(modelConstructor) {
    return new metadata_1.Metadata(modelConstructor);
}
exports.metadataForModel = metadataForModel;
//# sourceMappingURL=metadata-for-model.function.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogModel = void 0;
const objection_1 = require("objection");
class CatalogModel extends objection_1.Model {
    static get tableName() {
        return 'catalog';
    }
    static get idColumn() {
        return 'id';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['libelle'],
            properties: {
                id: { type: 'integer' },
                libelle: { type: 'string', minLength: 1, maxLength: 255 },
                color: { type: 'string', minLength: 1, maxLength: 255 },
            }
        };
    }
}
exports.CatalogModel = CatalogModel;
//# sourceMappingURL=catalogModel.js.map
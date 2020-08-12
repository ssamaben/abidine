"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const objection_1 = require("objection");
class ProductModel extends objection_1.Model {
    static get tableName() {
        return 'product';
    }
    static get idColumn() {
        return 'id';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'dateCreation', 'active'],
            properties: {
                id: { type: 'integer' },
                active: { type: 'boolean' },
                name: { type: 'string', minLength: 1 },
                description: { type: 'string' },
                image: { type: 'string', },
                color: { type: 'json' },
                prixInitial: { type: 'number' },
                prix: { type: 'number' },
                dateCreation: { type: 'date-time' },
                idCatalog: { type: 'number' },
                sizeType: { type: 'json' },
                proposed: { type: 'boolean' },
            }
        };
    }
    static get relationMappings() {
        return {
            catalog: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: __dirname + '/catalogModel',
                join: {
                    from: 'product.idCatalog',
                    to: 'catalog.id'
                }
            },
        };
    }
}
exports.ProductModel = ProductModel;
//# sourceMappingURL=productModel.js.map
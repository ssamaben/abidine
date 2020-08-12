"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModel = void 0;
const objection_1 = require("objection");
class PromotionModel extends objection_1.Model {
    static get tableName() {
        return 'promotion';
    }
    static get idColumn() {
        return 'id';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['dateDebut', 'dateFin', 'idProduct', 'actif'],
            properties: {
                id: { type: 'integer' },
                description: { type: 'string', minLength: 1, maxLength: 255 },
                dateDebut: { type: 'date-time' },
                dateFin: { type: 'date-time' },
                actif: { type: 'boolean' },
                idProduct: { type: 'integer' },
            }
        };
    }
    static get relationMappings() {
        return {
            product: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: __dirname + '/promotionModel',
                join: {
                    from: 'promotion.idProduct',
                    to: 'product.id'
                }
            },
        };
    }
}
exports.PromotionModel = PromotionModel;
//# sourceMappingURL=promotionModel.js.map
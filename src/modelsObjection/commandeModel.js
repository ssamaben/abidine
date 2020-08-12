"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandeModel = void 0;
const objection_1 = require("objection");
class CommandeModel extends objection_1.Model {
    static get tableName() {
        return 'commande';
    }
    static get idColumn() {
        return 'id';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['date', 'adresse', 'ville', 'prixAchat', 'idUser', 'idProduct', 'quantity'],
            properties: {
                id: { type: 'integer' },
                numeroCommande: { type: 'string', minLength: 1, maxLength: 255 },
                date: { type: 'date-time' },
                etat: { type: 'string', minLength: 1, maxLength: 255 },
                adresse: { type: 'string', minLength: 1, maxLength: 255 },
                ville: { type: 'string', minLength: 1, maxLength: 255 },
                codePostal: { type: 'string', minLength: 1, maxLength: 255 },
                prixAchat: { type: 'number' },
                idUser: { type: 'integer' },
                idProduct: { type: 'integer' },
                quantity: { type: 'integer' },
                selectedSize: { type: 'string', minLength: 1, maxLength: 255 },
                color: { type: 'string', minLength: 0, maxLength: 255 },
                datePrevue: { type: 'date-time' },
                dateArrivee: { type: 'date-time' },
            }
        };
    }
    static get relationMappings() {
        return {
            user: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: __dirname + '/userModel',
                join: {
                    from: 'commande.idUser',
                    to: 'user.id'
                }
            },
            product: {
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: __dirname + '/productModel',
                join: {
                    from: 'commande.idProduct',
                    to: 'product.id'
                }
            }
        };
    }
}
exports.CommandeModel = CommandeModel;
//# sourceMappingURL=commandeModel.js.map
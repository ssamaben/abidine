"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const objection_1 = require("objection");
class UserModel extends objection_1.Model {
    static get tableName() {
        return 'user';
    }
    static get idColumn() {
        return 'id';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['mail', 'nom', 'password', 'typeUser'],
            properties: {
                id: { type: 'integer' },
                nom: { type: 'string', minLength: 1, maxLength: 255 },
                prenom: { type: 'string', minLength: 1, maxLength: 255 },
                password: { type: 'string', minLength: 1, maxLength: 255 },
                adresse: { type: 'string', minLength: 1, maxLength: 255 },
                ville: { type: 'string', minLength: 1, maxLength: 255 },
                etat: { type: 'string', minLength: 1, maxLength: 255 },
                codePostal: { type: 'number' },
                panier: { type: 'json' },
                typeUser: { type: 'string', minLength: 1, maxLength: 255 },
                photo: { type: 'string', minLength: 1 },
                fonction: { type: 'string', minLength: 1, maxLength: 255 },
                telephone: { type: 'string', minLength: 1, maxLength: 20 },
                dateCreation: { type: 'date-time' },
            }
        };
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=userModel.js.map
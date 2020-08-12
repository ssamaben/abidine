"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigClientModel = void 0;
const objection_1 = require("objection");
class ConfigClientModel extends objection_1.Model {
    static get tableName() {
        return 'configClient';
    }
    static get idColumn() {
        return 'id';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['lib', 'valeur'],
            properties: {
                id: { type: 'integer' },
                valeur: { type: 'string', minLength: 1 },
                lib: { type: 'string', minLength: 1, maxLength: 255 },
                secret: { type: 'boolean' },
            }
        };
    }
}
exports.ConfigClientModel = ConfigClientModel;
//# sourceMappingURL=configClientModel.js.map
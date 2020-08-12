"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const user_service_1 = __importDefault(require("./services/user.service"));
const product_service_1 = __importDefault(require("./services/product.service"));
const commande_service_1 = __importDefault(require("./services/commande.service"));
const promotion_service_1 = __importDefault(require("./services/promotion.service"));
const server_1 = __importDefault(require("./server"));
const cors_1 = __importDefault(require("cors"));
const adresse_service_1 = __importDefault(require("./services/adresse.service"));
const config_service_1 = __importDefault(require("./services/config.service"));
var whitelist = ['abidine-project.herokuapp.com'];
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const server = new server_1.default(app, {
    imports: [
        bodyParser.json({ limit: '100mb' }),
        bodyParser.urlencoded({ limit: '100mb', extended: true }),
        cors_1.default({
            origin: function (origin, callback) {
                console.log('origin', origin);
                if (process.env.PORT == null) {
                    whitelist.push('localhost');
                }
                callback(null, true);
            }
        }),
    ],
    providers: [
        new user_service_1.default(),
        new product_service_1.default(),
        new commande_service_1.default(),
        new promotion_service_1.default(),
        new adresse_service_1.default(),
        new config_service_1.default()
    ],
});
server.listen();
console.log('ok');
//# sourceMappingURL=server.module.js.map
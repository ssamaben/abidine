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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const productModel_1 = require("../modelsObjection/productModel");
const acces_manager_1 = require("../outils/acces-manager");
class PromotionService {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/getPromotionProduct/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const obj = JSON.parse(req.params.obj);
            acces_manager_1.AccesManager.verifyTokenAndRun(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                const resQ = yield productModel_1.ProductModel.query()
                    .where({ idProduct: obj.idProduct })
                    .andWhere('dateDebut', '<=', new Date())
                    .andWhere('dateFin', '>=', new Date())
                    .first();
                res.status(200).send(resQ);
            }), res);
        }));
    }
}
exports.default = PromotionService;
//# sourceMappingURL=promotion.service.js.map
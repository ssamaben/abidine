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
const acces_manager_1 = require("../outils/acces-manager");
const express = __importStar(require("express"));
const productModel_1 = require("../modelsObjection/productModel");
class ProductService {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/getAllProduct', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('getAllProduct');
            let requet = productModel_1.ProductModel.query();
            if (!acces_manager_1.AccesManager.isAdmin(req.header('token'))) {
                requet = requet.where({
                    active: true
                });
                requet = requet.omit(['prixInitial']);
            }
            const listProduct = (yield requet);
            res.status(201).send(listProduct);
        }));
        this.router.get('/deleteProduct/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('deleteProduct');
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                console.log('delete ID:', req.params.id);
                if (req.params.id) {
                    try {
                        yield productModel_1.ProductModel.query().deleteById(req.params.id);
                    }
                    catch (err) {
                        res.status(201).send({ existCommande: true });
                        return;
                    }
                }
                res.status(201).send({ succes: true });
            }), res);
        }));
        this.router.post('/insertOrUpdateProduct', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('insertOrUpdateProduct');
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                const product = JSON.parse(decodeURIComponent(req.body.product));
                product['dateCreation'] = new Date();
                if (product.sizeType != null) {
                    product.sizeType = JSON.stringify(product.sizeType);
                }
                if (product.color != null) {
                    product.color = JSON.stringify(product.color);
                }
                if (product.idCatalog == null) {
                    product['idCatalog'] = 1;
                }
                if (product.proposed == null) {
                    product.proposed = false;
                }
                if (product.description == null) {
                    product.description = '';
                }
                if (product.active == null) {
                    product.active = true;
                }
                if (product['id'] != null) {
                    yield productModel_1.ProductModel.query().findById(product.id)
                        .patch(product);
                    res.status(200).send({ succes: true });
                    console.log('res updated.');
                }
                else {
                    const productRes = yield productModel_1.ProductModel.query()
                        .insert(product);
                    console.log('res inserted.');
                    res.status(200).send({ id: productRes.id });
                }
            }), res);
        }));
        this.router.get('/getProduct/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('getProduct');
            const product = yield productModel_1.ProductModel.query().findById(req.params.id);
            res.status(200).send(product);
        }));
    }
}
exports.default = ProductService;
//# sourceMappingURL=product.service.js.map
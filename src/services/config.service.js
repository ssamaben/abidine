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
const stockage_1 = require("./../outils/stockage");
const configClient_1 = require("./../models/configClient");
const acces_manager_1 = require("./../outils/acces-manager");
const configClientModel_1 = require("./../modelsObjection/configClientModel");
const express = __importStar(require("express"));
class ConfigClientService {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/updateConfig', (req, res) => __awaiter(this, void 0, void 0, function* () {
            acces_manager_1.AccesManager.verifyTokenAndRunForSuperADMIN(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                const config = JSON.parse(decodeURIComponent(req.body.config));
                let existSMTP = false;
                config.forEach((conf) => __awaiter(this, void 0, void 0, function* () {
                    conf.valeur = conf.valeur + '';
                    if (configClient_1.LIBCONFIG.SMTP[conf.lib] != null) {
                        existSMTP = true;
                    }
                    if (conf.secret == null || conf.secret + '' === 'null') {
                        conf.secret = false;
                    }
                    const index = stockage_1.StockageProject.ConfigClient.findIndex(configC => configC.lib === conf.lib);
                    stockage_1.StockageProject.ConfigClient[index].valeur = conf.valeur;
                    stockage_1.StockageProject.ConfigClientAsObject[conf.lib] = conf.valeur;
                    console.log('update conf', conf);
                    yield configClientModel_1.ConfigClientModel.query().findById(conf.id).patch(conf);
                    console.log('updated');
                }));
                if (existSMTP) {
                    stockage_1.StockageProject.setSMTP();
                }
                res.status(201).send({ succes: true });
            }), res);
        }));
        this.router.post('/getConfig', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const token = req.header('token');
            console.log('token', token);
            let requete = configClientModel_1.ConfigClientModel.query();
            if (token == null || !acces_manager_1.AccesManager.isSuperAdmin(token)) {
                requete = requete.where({
                    secret: false
                });
            }
            const runRequete = yield requete;
            res.status(200).send(runRequete);
        }));
    }
}
exports.default = ConfigClientService;
//# sourceMappingURL=config.service.js.map
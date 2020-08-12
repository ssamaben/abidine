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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const request = require('request');
class AdresseService {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/getAdresse/:adresse', (req, res) => {
            console.log('getAdresse...');
            request.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text='
                + req.params.adresse, { json: true }, (err, res2, body) => {
                res.status(200).send(body);
            });
        });
        this.router.get('/getExactAdresse/:key', (req, res) => {
            console.log('getExactAdresse...');
            request.get('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&magicKey='
                + req.params.key, { json: true }, (err, res2, body) => {
                res.status(200).send(body);
            });
        });
    }
}
exports.default = AdresseService;
//# sourceMappingURL=adresse.service.js.map
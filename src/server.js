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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configClientModel_1 = require("./modelsObjection/configClientModel");
const stockage_1 = require("./outils/stockage");
const express_1 = __importDefault(require("express"));
const chalk = require('chalk');
const path = require('path');
const socket_project_1 = __importDefault(require("./outils/socket-project"));
const configProject = __importStar(require("./../config.json"));
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const io = require('socket.io');
var jwt = require('jsonwebtoken');
class Server {
    constructor(app, appInit) {
        this.app = app;
        this.DIRECTORY_FRONT = '../FrontEndProject';
        stockage_1.StockageProject.config = configProject;
        stockage_1.StockageProject.configDatabase = {
            knex: knex_1.default({
                client: 'pg',
                connection: configProject.database
            }),
        };
        objection_1.Model.knex(stockage_1.StockageProject.configDatabase.knex);
        this.app.use(express_1.default.static('public'));
        console.log('****');
        console.log('process.env.PORT ', process.env.PORT);
        if (process.env.PORT != null) {
            this.DIRECTORY_FRONT = '../FrontEndProject';
        }
        this.app.use(express_1.default.static(path.join(__dirname, this.DIRECTORY_FRONT)));
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            yield this.setEnvironnement();
            this.middlewares(appInit.imports);
            this.routes(appInit.providers);
            this.app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, this.DIRECTORY_FRONT + '/index.html'));
            });
        }));
    }
    setEnvironnement() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('setEnvironnement');
            stockage_1.StockageProject.ConfigClient = (yield configClientModel_1.ConfigClientModel.query());
            stockage_1.StockageProject.ConfigClient.forEach(conf => {
                stockage_1.StockageProject.ConfigClientAsObject[conf.lib] = conf.valeur;
            });
            console.log('setSMTP');
            stockage_1.StockageProject.setSMTP();
        });
    }
    middlewares(middleWares) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }
    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use('/api/', controller.router);
        });
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            const server = this.app.listen(process.env.PORT || configProject.port, () => {
                console.log(chalk.green(`App Manager listening on the http://localhost:${process.env.PORT || configProject.port}`));
            });
            socket_project_1.default.socket = io(server, { serveClient: false });
            socket_project_1.default.socket.use((socket, next) => {
                if (socket.handshake.query && socket.handshake.query.token && socket.handshake.query.token !== 'null') {
                    jwt.verify(socket.handshake.query.token, stockage_1.StockageProject.config.secretToken, function (err, decoded) {
                        if (err) {
                            return next(new Error('Authentication error'));
                        }
                        ;
                        if (decoded.typeUser == null || decoded === null) {
                            return next(new Error('Authentication error'));
                        }
                        else {
                            return next();
                        }
                    });
                }
                else {
                    return next(new Error('Authentication error'));
                }
            }).on('connection', (socket) => {
                console.log('Client Socket Connected ID:', socket.client.id);
            });
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map
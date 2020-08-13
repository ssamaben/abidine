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
const configClientModel_1 = require("./../modelsObjection/configClientModel");
const configClient_1 = require("../models/configClient");
const acces_manager_1 = require("../outils/acces-manager");
const user_1 = require("./../models/user");
const stockage_1 = require("./../outils/stockage");
const express = __importStar(require("express"));
const message_1 = require("../enumerations/message");
const userModel_1 = require("../modelsObjection/userModel");
const httpError_1 = require("../enumerations/httpError");
var jwt = require('jsonwebtoken');
const socket_project_1 = __importDefault(require("../outils/socket-project"));
class UserService {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/authentification', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const inputObject = JSON.parse(decodeURIComponent(req.body.obj));
            const query = yield userModel_1.UserModel.query().where({
                mail: inputObject.mail
            }).first();
            const user = query;
            console.log('user', user);
            if (user == null) {
                return res.status(401).send({
                    error: httpError_1.HttpError.USER_NOT_FOUND,
                    message: message_1.MessageProject.ERROR.USER_NOT_FOUND
                });
            }
            console.log('inputObject', inputObject);
            if (inputObject.password === user.password) {
                user.token = jwt.sign({
                    id: user.id,
                    typeUser: user.typeUser,
                }, stockage_1.StockageProject.config.secretToken, {
                    expiresIn: stockage_1.StockageProject.config.tokenExpiration
                });
                delete user.password;
                res.status(200).send(user);
            }
            else {
                res.status(401).send({ error: httpError_1.HttpError.PASSWORD_INCORRECT, message: message_1.MessageProject.ERROR.PASSWORD_ERROR });
            }
        }));
        this.router.post('/updateUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('updateUser');
            jwt.verify(req.header('token'), stockage_1.StockageProject.config.secretToken, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                console.log('decoded', decoded);
                const newDataUser = JSON.parse(req.body.user);
                const userToModify = (yield userModel_1.UserModel.query().findById(newDataUser.id));
                console.log('userToModify', userToModify);
                console.log('newDataUser', newDataUser);
                switch (userToModify.typeUser) {
                    case user_1.TYPE_USER.SUPERADMIN:
                        if (decoded.typeUser !== user_1.TYPE_USER.SUPERADMIN) {
                            res.status(401).send({
                                error: httpError_1.HttpError.SUPER_ADMIN_REQUIRED,
                                message: message_1.MessageProject.ERROR.ADMIN_REQUIRED
                            });
                            return;
                        }
                    case user_1.TYPE_USER.ADMIN:
                        if (decoded.typeUser !== user_1.TYPE_USER.SUPERADMIN
                            && userToModify.id !== decoded.id) {
                            res.status(401).send({
                                error: httpError_1.HttpError.SUPER_ADMIN_REQUIRED,
                                message: message_1.MessageProject.ERROR.ADMIN_REQUIRED
                            });
                            return;
                        }
                    case user_1.TYPE_USER.SIMPLE:
                        console.log('update now');
                        const id = newDataUser.id;
                        if (newDataUser.id) {
                            delete newDataUser.id;
                        }
                        yield userModel_1.UserModel.query().findById(id).patch(newDataUser);
                        res.status(201).send({ succes: true });
                        break;
                    default:
                        res.status(401).send({ error: 'TYPE USER NOT FOUND', message: 'ERREUR INTERNE' });
                        break;
                }
            }));
        }));
        this.router.get('/mailExist/:mail', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('mailExist');
            const findUserMail = yield userModel_1.UserModel.query().where({
                mail: req.params.mail
            });
            res.status(201).send(findUserMail.length > 0);
        }));
        this.router.post('/verifyMailAndGenerateToken', (req, res) => __awaiter(this, void 0, void 0, function* () {
            stockage_1.StockageProject.setHostForMail(req);
            const dateNow = new Date();
            const tokenCreation = jwt.sign({ mail: req.body.mail }, stockage_1.StockageProject.config.secretToken, {
                expiresIn: 300
            });
            const configClient = yield configClientModel_1.ConfigClientModel.query();
            const sujbectConfirmationMail = configClient.find(conf => conf.lib === configClient_1.LIBCONFIG.COMPTE.SUBJECTMAILVALIDATIONCOMPTE);
            const contenuConfirmationMail = configClient.find(conf => conf.lib === configClient_1.LIBCONFIG.COMPTE.CONTENUMAILVALIDATIONCOMPTE);
            const mailOwner = configClient.find(config => config.lib === configClient_1.LIBCONFIG.SMTP.OWNERMAIL);
            const sendParamsClient = {
                subject: sujbectConfirmationMail.valeur,
                from: mailOwner.valeur,
                to: req.body.mail,
                html: contenuConfirmationMail.valeur,
                attachments: []
            };
            sendParamsClient.html =
                sendParamsClient.html
                    .replace(configClient_1.TAGS.GLOBALE.DATE, dateNow.toLocaleString())
                    .replace(configClient_1.TAGS.GLOBALE.LIENCONFIRMATIONCOMPTE, stockage_1.StockageProject.hostFront + '/validationCompte/' + tokenCreation);
            yield stockage_1.StockageProject.sendMail(sendParamsClient, configClient);
            res.status(201).send({ succes: true });
        }));
        this.router.post('/register', (req, res) => {
            console.log('== register ==');
            jwt.verify(req.body.tokenCreation, stockage_1.StockageProject.config.secretToken, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(401).send({
                        error: httpError_1.HttpError.TOKEN,
                        message: message_1.MessageProject.ERROR.TOKEN
                    });
                }
                else {
                    const userForm = JSON.parse(decodeURIComponent(req.body.user));
                    const findUserMail = yield userModel_1.UserModel.query().where({
                        mail: userForm.mail
                    });
                    console.log('findUserMail', findUserMail);
                    if (findUserMail.length > 0) {
                        res.status(501).send({
                            error: httpError_1.HttpError.MAIL_EXIST
                        });
                        return;
                    }
                    if (userForm.id == null) {
                        delete userForm.id;
                    }
                    userForm['typeUser'] = user_1.TYPE_USER.SIMPLE;
                    userForm['etat'] = user_1.ETAT_USER.VALIDE;
                    console.log('userForm', userForm);
                    userForm['dateCreation'] = new Date();
                    const userClient = yield userModel_1.UserModel.query().insert(userForm);
                    const configClient = yield configClientModel_1.ConfigClientModel.query();
                    const sujbectConfirmationMail = configClient.find(conf => conf.lib === configClient_1.LIBCONFIG.COMPTE.SUBJECTMAILBIENVENUE);
                    const contenuConfirmationMail = configClient.find(conf => conf.lib === configClient_1.LIBCONFIG.COMPTE.CONTENUMAILBIENVENUE);
                    const mailOwner = configClient.find(config => config.lib === configClient_1.LIBCONFIG.SMTP.OWNERMAIL);
                    const sendParamsClient = {
                        subject: sujbectConfirmationMail.valeur,
                        from: mailOwner.valeur,
                        to: req.body.mail,
                        html: contenuConfirmationMail.valeur,
                        attachments: []
                    };
                    const dateNow = new Date();
                    sendParamsClient.html =
                        sendParamsClient.html
                            .replace(configClient_1.TAGS.GLOBALE.DATE, dateNow.toLocaleString())
                            .replace(configClient_1.TAGS.CLIENT.NOMCLIENT, userClient.nom)
                            .replace(configClient_1.TAGS.CLIENT.MAILCLIENT, userClient.mail)
                            .replace(configClient_1.TAGS.CLIENT.PRENOMCLIENT, userClient.prenom)
                            .replace(configClient_1.TAGS.CLIENT.TELCLIENT, userClient.telephone)
                            .replace(configClient_1.TAGS.CLIENT.ADRESSECLIENT, userClient.adresse)
                            .replace(configClient_1.TAGS.CLIENT.VILLECLIENT, userClient.ville)
                            .replace(configClient_1.TAGS.CLIENT.CODEPOSTALCLIENT, userClient.codePostal);
                    yield stockage_1.StockageProject.sendMail(sendParamsClient, configClient);
                    userClient.token = jwt.sign({ id: userClient.id }, stockage_1.StockageProject.config.secretToken, {
                        expiresIn: stockage_1.StockageProject.config.tokenExpiration
                    });
                    delete userClient.password;
                    res.status(200).send(userClient);
                }
            }));
        });
        this.router.delete('/deleteUser/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), (decoded) => __awaiter(this, void 0, void 0, function* () {
                const userToModify = yield userModel_1.UserModel.query().findById(req.params.id);
                switch (userToModify.typeUser) {
                    case user_1.TYPE_USER.SUPERADMIN:
                        if (decoded.typeUser !== user_1.TYPE_USER.SUPERADMIN) {
                            res.status(401).send({
                                error: httpError_1.HttpError.SUPER_ADMIN_REQUIRED,
                                message: message_1.MessageProject.ERROR.ADMIN_REQUIRED
                            });
                            return;
                        }
                    case user_1.TYPE_USER.ADMIN:
                        if (decoded.typeUser !== user_1.TYPE_USER.SUPERADMIN
                            && userToModify.id !== decoded.id) {
                            res.status(401).send({
                                error: httpError_1.HttpError.SUPER_ADMIN_REQUIRED,
                                message: message_1.MessageProject.ERROR.ADMIN_REQUIRED
                            });
                            return;
                        }
                    case user_1.TYPE_USER.SIMPLE:
                        socket_project_1.default.sendMessage('USER' + userToModify.id, { disconnect: true });
                        yield userModel_1.UserModel.query().findById(req.params.id).delete();
                        res.status(201).send({ succes: true });
                }
            }), res);
        }));
        this.router.get('/getAllUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('== getAllUser ==');
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), (decoded) => __awaiter(this, void 0, void 0, function* () {
                const userFinded = yield userModel_1.UserModel.query().omit(['password']);
                res.status(200).send(userFinded);
            }), res);
        }));
        this.router.get('/getAllAdmin', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('== getAllAdmin ==');
            const userFinded = yield userModel_1.UserModel.query().whereNotNull('photo').andWhere({
                typeUser: user_1.TYPE_USER.SUPERADMIN
            }).orWhere({
                typeUser: user_1.TYPE_USER.ADMIN
            })
                .omit(['password', 'telephone', 'mail']);
            res.status(200).send(userFinded);
        }));
        this.router.get('/savePanier/:obj', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('== savePanier ==');
            const obj = JSON.parse(req.params.obj);
            console.log('token', req.header('token'));
            console.log('savePanier obj', obj);
            acces_manager_1.AccesManager.verifyTokenAndRun(req.header('token'), (decoded) => __awaiter(this, void 0, void 0, function* () {
                yield userModel_1.UserModel.query().findById(decoded.id).patch({
                    panier: JSON.stringify(obj.panier)
                });
                res.status(200).send({ succes: true });
            }), res);
        }));
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map
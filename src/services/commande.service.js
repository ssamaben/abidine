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
const configClient_1 = require("./../models/configClient");
const configClientModel_1 = require("./../modelsObjection/configClientModel");
const user_1 = require("./../models/user");
const socket_project_1 = require("./../outils/socket-project");
const commande_1 = require("./../models/commande");
const productModel_1 = require("./../modelsObjection/productModel");
const commandeModel_1 = require("./../modelsObjection/commandeModel");
const acces_manager_1 = require("../outils/acces-manager");
const stockage_1 = require("./../outils/stockage");
const express = __importStar(require("express"));
const userModel_1 = require("../modelsObjection/userModel");
const socket_project_2 = __importDefault(require("../outils/socket-project"));
class CommandeService {
    constructor() {
        this.router = express.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/commander', (req, res) => {
            acces_manager_1.AccesManager.verifyTokenAndRun(req.header('token'), (decoded) => __awaiter(this, void 0, void 0, function* () {
                const obj = JSON.parse(decodeURIComponent(req.body.obj));
                const userClient = (yield userModel_1.UserModel.query().findById(decoded.id));
                const commandes = [];
                const dateNow = new Date();
                const ids = obj.products.map(prod => prod.id);
                const product = (yield productModel_1.ProductModel.query().findByIds(ids));
                obj.products.forEach((prodCommande) => __awaiter(this, void 0, void 0, function* () {
                    prodCommande.prix = +prodCommande.prix;
                    prodCommande.prixInitial = +prodCommande.prixInitial;
                    prodCommande.quantity = +prodCommande.quantity || 1;
                    const prodDistant = product.find(prod => prod.id === prodCommande.id);
                    commandes.push({
                        date: dateNow,
                        etat: commande_1.ETAT_COMMANDE.WAITINGFORVALIDATION,
                        adresse: obj.adresse,
                        ville: obj.ville,
                        codePostal: obj.codePostal + '',
                        idUser: +decoded.id,
                        idProduct: +prodCommande.id,
                        prixAchat: +prodDistant.prix,
                        quantity: prodCommande.quantity || 1,
                        color: prodCommande.selectedColor || '',
                        selectedSize: prodCommande.selectedSize,
                        user: userClient,
                        product: prodCommande
                    });
                }));
                const numeroCommande = obj.ville.substr(0, 3).toUpperCase() + userClient.id + '-' + dateNow.getTime();
                commandes.forEach((commande) => __awaiter(this, void 0, void 0, function* () {
                    commande['numeroCommande'] = numeroCommande + '-' + commande.idProduct;
                }));
                const commande = commandes[0];
                (yield commandeModel_1.CommandeModel.query().insert(commandes).returning('id'));
                const configClient = yield configClientModel_1.ConfigClientModel.query();
                console.log('sendmMessageSocket');
                socket_project_2.default.sendMessage(socket_project_1.SocketEnum.COMMANDEINSERT, commandes);
                console.log('setHostForMail');
                stockage_1.StockageProject.setHostForMail(req);
                const mailOwner = configClient.find(config => config.lib === configClient_1.LIBCONFIG.SMTP.OWNERMAIL);
                const subjectClientCommandeOk = configClient.find(config => config.lib === configClient_1.LIBCONFIG.COMMANDE.SUBJECTMAILCOMMANDEOK);
                const contenuClientCommandeOk = configClient.find(config => config.lib === configClient_1.LIBCONFIG.COMMANDE.CONTENUMAILCOMMANDEOK);
                const sendParamsClient = {
                    subject: subjectClientCommandeOk.valeur,
                    from: mailOwner.valeur,
                    to: userClient.mail,
                    html: contenuClientCommandeOk.valeur,
                    attachments: []
                };
                console.log('11');
                sendParamsClient.html = sendParamsClient.html
                    .replace(configClient_1.TAGS.COMMANDE.NUMEROCOMMANDE, numeroCommande)
                    .replace(configClient_1.TAGS.GLOBALE.DATE, dateNow.toLocaleString())
                    .replace(configClient_1.TAGS.COMMANDE.ADRESSELIVRAISON, commande.adresse)
                    .replace(configClient_1.TAGS.COMMANDE.VILLELIVRAISON, commande.ville)
                    .replace(configClient_1.TAGS.COMMANDE.CODEPOSTALLivraison, commande.codePostal)
                    .replace(configClient_1.TAGS.CLIENT.NOMCLIENT, userClient.nom)
                    .replace(configClient_1.TAGS.CLIENT.MAILCLIENT, userClient.mail)
                    .replace(configClient_1.TAGS.CLIENT.PRENOMCLIENT, userClient.prenom)
                    .replace(configClient_1.TAGS.CLIENT.TELCLIENT, userClient.telephone)
                    .replace(configClient_1.TAGS.CLIENT.ADRESSECLIENT, userClient.adresse)
                    .replace(configClient_1.TAGS.CLIENT.VILLECLIENT, userClient.ville)
                    .replace(configClient_1.TAGS.CLIENT.CODEPOSTALCLIENT, userClient.codePostal);
                console.log('22');
                yield stockage_1.StockageProject.sendMail(sendParamsClient, configClient);
                const subjectNotifAdmin = configClient.find(config => config.lib === configClient_1.LIBCONFIG.COMMANDE.SUBJECTMAILNOTIFCOMMANDEOK);
                const contenuNotifAdmin = configClient.find(config => config.lib === configClient_1.LIBCONFIG.COMMANDE.CONTENUMAILNOTIFCOMMANDEOK);
                let requet = userModel_1.UserModel.query().where({
                    typeUser: user_1.TYPE_USER.SUPERADMIN
                });
                const adminMail = configClient.find(config => config.lib === configClient_1.LIBCONFIG.GLOBAL.MAILFORADMIN).valeur === 'true';
                if (adminMail) {
                    requet = requet.orWhere({
                        typeUser: user_1.TYPE_USER.ADMIN
                    });
                }
                const userFinded = (yield requet);
                const sendParamsAdmin = {
                    subject: subjectNotifAdmin.valeur,
                    from: mailOwner.valeur,
                    html: contenuNotifAdmin.valeur,
                    attachments: []
                };
                sendParamsAdmin.html = sendParamsAdmin.html
                    .replace(configClient_1.TAGS.COMMANDE.NUMEROCOMMANDE, numeroCommande)
                    .replace(configClient_1.TAGS.GLOBALE.DATE, dateNow.toLocaleString())
                    .replace(configClient_1.TAGS.COMMANDE.ADRESSELIVRAISON, commande.adresse)
                    .replace(configClient_1.TAGS.COMMANDE.VILLELIVRAISON, commande.ville)
                    .replace(configClient_1.TAGS.COMMANDE.CODEPOSTALLivraison, commande.codePostal)
                    .replace(configClient_1.TAGS.CLIENT.NOMCLIENT, userClient.nom)
                    .replace(configClient_1.TAGS.CLIENT.MAILCLIENT, userClient.mail)
                    .replace(configClient_1.TAGS.CLIENT.PRENOMCLIENT, userClient.prenom)
                    .replace(configClient_1.TAGS.CLIENT.TELCLIENT, userClient.telephone)
                    .replace(configClient_1.TAGS.CLIENT.ADRESSECLIENT, userClient.adresse)
                    .replace(configClient_1.TAGS.CLIENT.VILLECLIENT, userClient.ville)
                    .replace(configClient_1.TAGS.CLIENT.CODEPOSTALCLIENT, userClient.codePostal);
                console.log('33');
                userFinded.forEach((admin) => __awaiter(this, void 0, void 0, function* () {
                    sendParamsAdmin['to'] = admin.mail;
                    console.log('sendParamsAdmin', sendParamsAdmin);
                    yield stockage_1.StockageProject.sendMail(sendParamsAdmin, configClient);
                }));
                console.log('44');
                res.status(200).send({ succes: true });
            }), res);
        });
        this.router.post('/myCommandes', (req, res) => {
            acces_manager_1.AccesManager.verifyTokenAndRun(req.header('token'), (decoded) => __awaiter(this, void 0, void 0, function* () {
                const commande = yield commandeModel_1.CommandeModel.query().where({
                    idUser: decoded.id
                }).withGraphFetched({
                    product: true
                }).orderBy('date', 'desc');
                res.status(200).send(commande);
            }), res);
        });
        this.router.get('/countCommandes', (req, res) => {
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                console.log('async *******************************');
                let total = (yield commandeModel_1.CommandeModel.query().count('id'))[0];
                total = total ? +total['count'] : 0;
                console.log('here *******************************');
                let livraison = (yield commandeModel_1.CommandeModel.query().where('etat', commande_1.ETAT_COMMANDE.WAITING).count('id'))[0];
                livraison = livraison ? +livraison['count'] : 0;
                let encours = (yield commandeModel_1.CommandeModel.query().where('etat', commande_1.ETAT_COMMANDE.WAITINGFORVALIDATION).count('id'))[0];
                encours = encours ? +encours['count'] : 0;
                const result = (yield commandeModel_1.CommandeModel.query().where('etat', commande_1.ETAT_COMMANDE.WAITINGFORVALIDATION).count('id'))[0];
                console.log('etat wait', result);
                let envoyee = (yield commandeModel_1.CommandeModel.query().where('etat', commande_1.ETAT_COMMANDE.SENDED).count('id'))[0];
                envoyee = envoyee ? +envoyee['count'] : 0;
                let annulee = (yield commandeModel_1.CommandeModel.query().where('etat', commande_1.ETAT_COMMANDE.ANNULEE).count('id'))[0];
                annulee = annulee ? +annulee['count'] : 0;
                console.log('send', {
                    total,
                    livraison,
                    encours,
                    envoyee,
                    annulee
                });
                res.status(201).send({
                    total,
                    livraison,
                    encours,
                    envoyee,
                    annulee
                });
            }), res);
        });
        this.router.get('/productStatistiques', (req, res) => {
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                let stat = yield commandeModel_1.CommandeModel.query().joinRelated('product', { alias: 'p' })
                    .select('p.name').count('p.name').groupBy('p.name');
                console.log('stat', stat);
                res.send(stat);
            }), res);
        });
        this.router.post('/getAllCommande', (req, res) => {
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), () => __awaiter(this, void 0, void 0, function* () {
                let requet = commandeModel_1.CommandeModel.query();
                if (req.body.obj) {
                    const obj = JSON.parse(decodeURIComponent(req.body.obj));
                    console.log('obj', obj);
                    if (obj.etat != null) {
                        requet = requet.where({
                            etat: obj.etat
                        });
                    }
                    if (obj.dateFrom != null) {
                        requet = requet.where('date', '>=', obj.dateFrom);
                    }
                    if (new Date(obj.dateFrom).getTime() !== new Date(obj.dateTo).getTime() && obj.dateTo != null) {
                        requet = requet.where('date', '<=', obj.dateTo);
                    }
                }
                const listCommande = yield requet.withGraphFetched({
                    user: true,
                    product: true
                }).orderBy('date', 'desc');
                res.status(200).send(listCommande);
            }), res);
        });
        this.router.post('/updateCommande', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('updateCommande');
            acces_manager_1.AccesManager.verifyTokenAndRunForADMIN(req.header('token'), (decoded) => __awaiter(this, void 0, void 0, function* () {
                console.log('decoded', decoded);
                const newCommandeUpdate = JSON.parse(req.body.commande);
                console.log('newCommandeUpdate', newCommandeUpdate);
                console.log('update now');
                const id = newCommandeUpdate.id;
                if (newCommandeUpdate.id) {
                    delete newCommandeUpdate.id;
                }
                yield commandeModel_1.CommandeModel.query().findById(id).patch(newCommandeUpdate);
                res.status(201).send({ succes: true });
            }), res);
        }));
    }
}
exports.default = CommandeService;
//# sourceMappingURL=commande.service.js.map
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
exports.StockageProject = void 0;
const NodeMailer = __importStar(require("nodemailer"));
const configClient_1 = require("./../models/configClient");
const axios = require('axios');
class StockageProject {
    static setSMTP() {
        if (StockageProject.ConfigClientAsObject != null) {
            const conf = {
                host: StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.HOSTMAIL],
                port: +StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.PORTMAIL],
                secure: StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.SSLMAIL] === 'true',
                auth: {
                    user: StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.OWNERMAIL],
                    pass: StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.PASSWORDMAIL],
                },
                tls: {
                    rejectUnauthorized: false
                }
            };
            if (StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.SERVICE] != null
                && StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.SERVICE] !== '') {
                conf['service'] = StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.SERVICE];
            }
            if (StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.DOMAINE] != null
                && StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.DOMAINE] !== '') {
                conf['domains'] = StockageProject.ConfigClientAsObject[configClient_1.LIBCONFIG.SMTP.DOMAINE] + ''.split(',');
            }
            StockageProject.clientSMTP = NodeMailer.createTransport(conf);
        }
    }
    static sendMail(messageClient, config) {
        messageClient.html = '<html><body>' + messageClient.html;
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            if (messageClient.html.indexOf('@signature') >= 0) {
                let signature = config.find(conf => conf.lib === 'SIGNATURE').valeur;
                if (signature.indexOf('@logo') >= 0) {
                    signature = signature.replace('@logo', `<img src='cid:logoZaynArt' height='100' width='100'>`);
                    let image = yield axios.get(this.hostFront + '/assets/logo.jpg', { responseType: 'arraybuffer' });
                    let base64String = Buffer.from(image.data).toString('base64');
                    messageClient.attachments.push({
                        filename: "ZaynArt.jpeg",
                        encoding: 'base64',
                        content: base64String,
                        headers: { 'Content-ID': '<logoZaynArt>' },
                        cid: 'logoZaynArt'
                    });
                }
                messageClient.html = messageClient.html.replace('@signature', signature);
            }
            messageClient.html += `</body></html>`;
            StockageProject.clientSMTP.sendMail(messageClient, (err, message) => {
                if (err) {
                    console.log('Client :', err);
                }
            });
        }));
    }
    static setHostForMail(req) {
        if (this.hostFront == null) {
            this.hostFront = req.get('host');
            if (process.env.PORT == null) {
                this.hostFront = this.hostFront.replace('8081', '4200');
                if (this.hostFront.indexOf('http') < 0) {
                    this.hostFront = 'http://' + this.hostFront;
                }
            }
        }
    }
}
exports.StockageProject = StockageProject;
StockageProject.ConfigClient = [];
StockageProject.ConfigClientAsObject = {};
//# sourceMappingURL=stockage.js.map
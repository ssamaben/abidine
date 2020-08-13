"use strict";
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
const nodemailer = require("nodemailer");
const configClient_1 = require("./../models/configClient");
class StockageProject {
    static sendMail(messageClient, config) {
        return __awaiter(this, void 0, void 0, function* () {
            messageClient.html = '<html><body>' + messageClient.html;
            console.log('sendMail 11');
            if (messageClient.html.indexOf('@signature') >= 0) {
                let signature = config.find(conf => conf.lib === 'SIGNATURE').valeur;
                if (signature.indexOf('@logo') >= 0) {
                    signature = signature.replace('@logo', `<img src='cid:logoZaynArt' height='100' width='100'>`);
                    var img = require("fs").readFileSync("dist/FrontEndProject/assets/logo.jpg");
                    messageClient.attachments.push({
                        filename: "ZaynArt.jpeg",
                        content: img,
                        headers: { 'Content-ID': '<logoZaynArt>' },
                        cid: 'logoZaynArt'
                    });
                }
                messageClient.html = messageClient.html.replace('@signature', signature);
            }
            console.log('sendMail 22');
            messageClient.html += `</body></html>`;
            console.log('sendMail 33');
            yield this.sendMessage(messageClient).catch(console.error);
            ;
            console.log('sendMail 44');
        });
    }
    static setHostForMail(req) {
        if (this.hostFront == null) {
            console.log('getHost');
            this.hostFront = req.get('host');
            console.log('this.hostFront', this.hostFront);
            if (process.env.PORT == null) {
                this.hostFront = this.hostFront.replace('8081', '4200');
                if (this.hostFront.indexOf('http') < 0) {
                    this.hostFront = 'http://' + this.hostFront;
                }
            }
        }
    }
    static sendMessage(objMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('objMessage', objMessage);
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
            console.log('conf', conf);
            let transporter = nodemailer.createTransport(conf);
            let info = yield transporter.sendMail(objMessage);
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
    }
}
exports.StockageProject = StockageProject;
StockageProject.ConfigClient = [];
StockageProject.ConfigClientAsObject = {};
//# sourceMappingURL=stockage.js.map
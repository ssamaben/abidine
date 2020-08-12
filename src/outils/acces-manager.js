"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesManager = void 0;
const user_1 = require("../models/user");
const stockage_1 = require("./stockage");
const message_1 = require("../enumerations/message");
const httpError_1 = require("../enumerations/httpError");
var jwt = require('jsonwebtoken');
class AccesManager {
    static verifyTokenAndRun(token, succes, resForError, succesOnlyForType) {
        jwt.verify(token, stockage_1.StockageProject.config.secretToken, (err, decoded) => {
            console.log('jwt verify***');
            console.log('decoded', decoded);
            console.log('err', err);
            if (err) {
                resForError.status(401).send({
                    error: httpError_1.HttpError.TOKEN,
                    message: message_1.MessageProject.ERROR.TOKEN
                });
            }
            else {
                if (succesOnlyForType == null || decoded.typeUser === user_1.TYPE_USER.SUPERADMIN || decoded.typeUser === succesOnlyForType) {
                    succes(decoded);
                }
                else {
                    resForError.status(401).send({
                        error: httpError_1.HttpError.USER_NOT_FOUND,
                        message: message_1.MessageProject.ERROR.ADMIN_REQUIRED
                    });
                }
            }
        });
    }
    static verifyTokenAndRunForADMIN(token, succes, resForError) {
        this.verifyTokenAndRun(token, succes, resForError, user_1.TYPE_USER.ADMIN);
    }
    static verifyTokenAndRunForSuperADMIN(token, succes, resForError) {
        this.verifyTokenAndRun(token, succes, resForError, user_1.TYPE_USER.SUPERADMIN);
    }
    static isAdmin(token) {
        if (token == null) {
            return false;
        }
        let decodedToken;
        jwt.verify(token, stockage_1.StockageProject.config.secretToken, (err, decoded) => {
            decodedToken = decoded;
        });
        return decodedToken != null && (decodedToken.typeUser === user_1.TYPE_USER.ADMIN
            || decodedToken.typeUser === user_1.TYPE_USER.SUPERADMIN);
    }
    static isSuperAdmin(token) {
        if (token == null) {
            return false;
        }
        let decodedToken;
        jwt.verify(token, stockage_1.StockageProject.config.secretToken, (err, decoded) => {
            decodedToken = decoded;
        });
        return decodedToken != null && decodedToken.typeUser === user_1.TYPE_USER.SUPERADMIN;
    }
}
exports.AccesManager = AccesManager;
//# sourceMappingURL=acces-manager.js.map
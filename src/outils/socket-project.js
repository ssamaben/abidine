"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEnum = void 0;
class SocketProject {
    static sendMessage(idClient, message, fromInit) {
        console.log('sendMessage to:' + idClient);
        if (fromInit || idClient === 'none') {
            return;
        }
        if (this.socketLock) {
            setTimeout(() => {
                console.log('setTimeout...');
                this.sendMessage(idClient, message);
            }, 1000);
            return;
        }
        this.socketLock = true;
        try {
            console.log('sendSocket');
            this.socket.emit((idClient || 'all'), JSON.stringify(message));
            console.log('unlock');
            this.socketLock = false;
        }
        catch (e) {
        }
    }
}
exports.default = SocketProject;
SocketProject.socketLock = false;
var SocketEnum;
(function (SocketEnum) {
    SocketEnum["COMMANDEINSERT"] = "commandeInsert";
})(SocketEnum = exports.SocketEnum || (exports.SocketEnum = {}));
//# sourceMappingURL=socket-project.js.map
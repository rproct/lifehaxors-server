"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MainControl = void 0;
var socket_controllers_1 = require("socket-controllers");
var socket_io_1 = require("socket.io");
var roomList = Array();
var MainControl = /** @class */ (function () {
    function MainControl() {
    }
    MainControl.prototype.onConnection = function (socket, io) {
        console.log("Socket ID " + socket.id + " connected");
    };
    MainControl.prototype.createRoom = function (io, socket, message) {
        return __awaiter(this, void 0, void 0, function () {
            var roomID, i, nRoom, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // while(roomList.find(r => r.roomID === roomID).userList.length !== 0 && (roomID !== '' || roomID !== undefined)){
                        roomID = '';
                        for (i = 0; i < 4; i++)
                            roomID += String.fromCharCode(Math.random() * (90 - 65) + 65);
                        // }
                        return [4 /*yield*/, socket.join(roomID)];
                    case 1:
                        // }
                        _a.sent();
                        nRoom = { roomID: roomID, lock: false, userList: [{ id: socket.id, name: message.name }], houseItems: [] };
                        index = roomList.push(nRoom) - 1;
                        socket.emit("joinedSuccess");
                        io["in"](roomID).emit("updateRoom", roomList[index]);
                        console.log(nRoom);
                        return [2 /*return*/];
                }
            });
        });
    };
    MainControl.prototype.joinRoom = function (io, socket, message) {
        return __awaiter(this, void 0, void 0, function () {
            var room, nUser, currentRoom;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room = roomList.find(function (r) { return r.roomID === message.roomID; });
                        if (!(room === undefined || room.userList.length === 0)) return [3 /*break*/, 1];
                        socket.emit("joinRoomErr", { error: "Room does not exist." });
                        console.log({ error: "Room does not exist." });
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(room.userList.length === 8)) return [3 /*break*/, 2];
                        socket.emit("joinRoomErr", { error: "Room is full, please pick another room." });
                        console.log({ error: "Room is full, please pick another room." });
                        return [3 /*break*/, 5];
                    case 2:
                        if (!room.lock) return [3 /*break*/, 3];
                        socket.emit("joinRoomErr", { error: "Room is currently in an active game." });
                        console.log({ error: "Room is currently in an active game." });
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, socket.join(message.roomID)];
                    case 4:
                        _a.sent();
                        nUser = { id: socket.id, name: message.name };
                        currentRoom = roomList.find(function (room) { return room.roomID === message.roomID; });
                        currentRoom.userList.push(nUser);
                        socket.emit("joinedSuccess");
                        io["in"](currentRoom.roomID).emit("updateRoom", currentRoom);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MainControl.prototype.sendTemplate = function (io, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var questions, rand;
            return __generator(this, function (_a) {
                questions = require('../data/questionTemplates.json');
                rand = questions[Math.floor(Math.random() * questions.length)];
                socket.emit("receiveTemplate", rand);
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.submitQuestion = function (io, socket, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                io["in"](this.getRoom(socket).roomID).emit("receiveQuestion", {
                    id: socket.id,
                    question: message.question
                });
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.generatePairs = function (io, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var room, senders, recipients, pairs, s, r, newPair, i;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                senders = [].concat(room.userList);
                recipients = [].concat(room.userList);
                pairs = [];
                while (senders.length > 0 && recipients.length > 0) {
                    s = Math.floor(Math.random() * senders.length);
                    r = Math.floor(Math.random() * recipients.length);
                    if (senders[s] !== recipients[r]) {
                        newPair = { sendID: senders[s].id, recipID: recipients[r].id };
                        pairs.push(newPair);
                        senders.splice(s, 1);
                        recipients.splice(r, 1);
                    }
                }
                for (i = 0; i < pairs.length; i++)
                    io.to(pairs[i].sendID).emit("getPair", { recipient: pairs[i].recipID });
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.addListItems = function (io, socket, message) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                message.houseItems.forEach(function (item) {
                    room.houseItems.push(item);
                });
                io["in"](room.roomID).emit("playerReady", { data: room.houseItems.length / 6 });
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.appendListToQuestions = function (io, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var room, players, list, dist, i;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                players = room.userList;
                players.sort(function () { return Math.random() - 0.5; });
                list = [].concat(room.houseItems);
                room.houseItems = [];
                dist = [];
                for (i = 0; i < players.length; i++) {
                    list.sort(function () { return Math.random() - 0.5; });
                    dist.push({ id: players[i].id, items: list.slice(0, 6) });
                    list = list.slice(6);
                }
                io["in"](room.roomID).emit("setQuestionList", { dist: dist });
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.getOrder = function (io, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var room, players;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                players = room.userList;
                players.sort(function () { return Math.random() - 0.5; });
                io["in"](room.roomID).emit("generateOrder", { order: players });
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.broadcastStart = function (io, socket) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                if (room)
                    io["in"](room.roomID).emit("toggleStart");
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.sendAnswer = function (io, socket, message) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                if (room)
                    io["in"](room.roomID).emit("receiveAnswer", { data: message });
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.disconnect = function (socket) {
        return __awaiter(this, void 0, void 0, function () {
            var room, i, i;
            return __generator(this, function (_a) {
                room = this.getRoom(socket);
                for (i = 0; i < room.userList.length; i++)
                    if (room.userList[i].id === socket.id) {
                        room.userList.splice(i, 1);
                        socket.to(room.roomID).emit("updateRoom", room);
                        break;
                    }
                if (room.userList.length === 0)
                    for (i = 0; i < roomList.length; i++)
                        if (roomList[i].roomID === room.roomID) {
                            roomList.splice(i, 1);
                            break;
                        }
                return [2 /*return*/];
            });
        });
    };
    MainControl.prototype.getRoom = function (socket) {
        var gameRoom;
        roomList.forEach(function (room) {
            if (room.userList.find(function (user) { return user.id === socket.id; }))
                gameRoom = room;
        });
        return gameRoom;
    };
    __decorate([
        (0, socket_controllers_1.OnConnect)(),
        __param(0, (0, socket_controllers_1.ConnectedSocket)()),
        __param(1, (0, socket_controllers_1.SocketIO)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Socket,
            socket_io_1.Server]),
        __metadata("design:returntype", void 0)
    ], MainControl.prototype, "onConnection");
    __decorate([
        (0, socket_controllers_1.OnMessage)("createRoom"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket, Object]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "createRoom");
    __decorate([
        (0, socket_controllers_1.OnMessage)("joinRoom"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket, Object]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "joinRoom");
    __decorate([
        (0, socket_controllers_1.OnMessage)("sendTemplate"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "sendTemplate");
    __decorate([
        (0, socket_controllers_1.OnMessage)("sendQuestion"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket, Object]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "submitQuestion");
    __decorate([
        (0, socket_controllers_1.OnMessage)("generatePairs"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "generatePairs");
    __decorate([
        (0, socket_controllers_1.OnMessage)("addListItems"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket, Object]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "addListItems");
    __decorate([
        (0, socket_controllers_1.OnMessage)("appendListToQuestions"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "appendListToQuestions");
    __decorate([
        (0, socket_controllers_1.OnMessage)("getOrder"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "getOrder");
    __decorate([
        (0, socket_controllers_1.OnMessage)("startGame"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "broadcastStart");
    __decorate([
        (0, socket_controllers_1.OnMessage)("sendAnswer"),
        __param(0, (0, socket_controllers_1.SocketIO)()),
        __param(1, (0, socket_controllers_1.ConnectedSocket)()),
        __param(2, (0, socket_controllers_1.MessageBody)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Server,
            socket_io_1.Socket, Object]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "sendAnswer");
    __decorate([
        (0, socket_controllers_1.OnDisconnect)(),
        __param(0, (0, socket_controllers_1.ConnectedSocket)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [socket_io_1.Socket]),
        __metadata("design:returntype", Promise)
    ], MainControl.prototype, "disconnect");
    MainControl = __decorate([
        (0, socket_controllers_1.SocketController)()
    ], MainControl);
    return MainControl;
}());
exports.MainControl = MainControl;

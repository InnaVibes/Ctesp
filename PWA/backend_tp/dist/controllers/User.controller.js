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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignExistingClient = exports.addClientByPT = exports.getAvailablePTs = exports.requestPT = exports.updateProfile = exports.getMyClients = exports.adminChangePt = exports.deleteUser = exports.validateUser = exports.getPendingPTs = exports.getAllUsers = exports.searchUser = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
// Pesquisar utilizador por nome ou email
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Parâmetro de pesquisa obrigatório' });
        }
        const user = yield User_1.User.findOne({
            $or: [
                { username: { $regex: new RegExp(`^${query}$`, 'i') } },
                { email: { $regex: new RegExp(`^${query}$`, 'i') } }
            ]
        }).select('-password');
        if (!user)
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
exports.searchUser = searchUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select('-password');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
exports.getAllUsers = getAllUsers;
// ADMIN: Listar PTs pendentes de validação
const getPendingPTs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingPTs = yield User_1.User.find({ role: 'PT', isValidated: false }).select('-password');
        res.json(pendingPTs);
    }
    catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
exports.getPendingPTs = getPendingPTs;
// ADMIN: Validar (Aprovar) um PT
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { isValidated: true }, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }
        res.json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
exports.validateUser = validateUser;
// ADMIN: Remover um utilizador
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield User_1.User.findByIdAndDelete(userId);
        res.json({ message: "Utilizador removido com sucesso" });
    }
    catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});
exports.deleteUser = deleteUser;
// ADMIN: Alterar o PT de um cliente
const adminChangePt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, newPtId } = req.body;
        const newPt = yield User_1.User.findById(newPtId);
        if (!newPt || newPt.role !== 'PT') {
            return res.status(400).json({ message: "ID do novo Personal Trainer inválido." });
        }
        const user = yield User_1.User.findByIdAndUpdate(userId, { ptId: newPtId }, { new: true }).select('-password');
        res.json({ message: "Personal Trainer alterado com sucesso.", user });
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao alterar PT." });
    }
});
exports.adminChangePt = adminChangePt;
// PT: Obter os seus clientes
const getMyClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Não autenticado' });
        }
        const ptId = req.user._id;
        const clients = yield User_1.User.find({ ptId: ptId }).select('-password');
        res.json(clients);
    }
    catch (err) {
        res.status(500).json({ error: 'Erro ao buscar clientes associados.' });
    }
});
exports.getMyClients = getMyClients;
// GENÉRICO: Atualizar o próprio perfil
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Não autenticado' });
        }
        const updates = req.body;
        const allowedUpdates = ['username', 'profileImage', 'themePreference'];
        const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
            obj[key] = updates[key];
            return obj;
        }, {});
        const user = yield User_1.User.findByIdAndUpdate(req.user._id, filteredUpdates, { new: true }).select('-password');
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.updateProfile = updateProfile;
// Cliente solicita PT
const requestPT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ptId } = req.body;
        if (!req.user || req.user.role !== 'CLIENT') {
            return res.status(403).json({ message: 'Apenas clientes podem solicitar PT' });
        }
        const pt = yield User_1.User.findById(ptId);
        if (!pt || pt.role !== 'PT') {
            return res.status(404).json({ message: 'PT não encontrado' });
        }
        if (!pt.isValidated) {
            return res.status(400).json({ message: 'Este PT ainda não foi validado' });
        }
        const client = yield User_1.User.findById(req.user._id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        client.ptId = new mongoose_1.Types.ObjectId(req.user._id);
        yield client.save();
        res.json({ message: 'PT atribuído com sucesso', client });
    }
    catch (err) {
        console.error('Erro ao solicitar PT:', err);
        res.status(500).json({ error: 'Erro ao solicitar PT' });
    }
});
exports.requestPT = requestPT;
// Listar PTs validados disponíveis
const getAvailablePTs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pts = yield User_1.User.find({
            role: 'PT',
            isValidated: true
        }).select('username email profileImage');
        res.json(pts);
    }
    catch (err) {
        console.error('Erro ao buscar PTs:', err);
        res.status(500).json({ error: 'Erro ao buscar PTs' });
    }
});
exports.getAvailablePTs = getAvailablePTs;
// PT adiciona cliente manualmente (via registro)
const addClientByPT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        if (!req.user || req.user.role !== 'PT') {
            return res.status(403).json({ message: 'Apenas PTs podem adicionar clientes' });
        }
        const existingUser = yield User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username já existe' });
        }
        if (email) {
            const existingEmail = yield User_1.User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email já está registado' });
            }
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newClient = new User_1.User({
            username,
            password: hashedPassword,
            email,
            role: 'CLIENT',
            ptId: new mongoose_1.Types.ObjectId(req.user._id),
            isValidated: true,
        });
        yield newClient.save();
        const _a = newClient.toObject(), { password: _ } = _a, clientResponse = __rest(_a, ["password"]);
        res.status(201).json(clientResponse);
    }
    catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    }
});
exports.addClientByPT = addClientByPT;
// PT atribui cliente existente a si mesmo
const assignExistingClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientId } = req.body;
        if (!req.user || req.user.role !== 'PT') {
            return res.status(403).json({ message: 'Apenas PTs podem atribuir clientes' });
        }
        const client = yield User_1.User.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        if (client.role !== 'CLIENT') {
            return res.status(400).json({ message: 'Este utilizador não é um cliente' });
        }
        client.ptId = new mongoose_1.Types.ObjectId(req.user._id);
        yield client.save();
        const _a = client.toObject(), { password: _ } = _a, clientResponse = __rest(_a, ["password"]);
        res.json({ message: 'Cliente atribuído com sucesso', client: clientResponse });
    }
    catch (err) {
        console.error('Erro ao atribuir cliente:', err);
        res.status(500).json({ error: 'Erro ao atribuir cliente' });
    }
});
exports.assignExistingClient = assignExistingClient;

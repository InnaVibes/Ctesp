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
exports.resetPassword = exports.validateResetToken = exports.forgotPassword = exports.qrLogin = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../config/email");
const SECRET_KEY = process.env.JWT_SECRET || "pwa_secret_key";
const FRONTEND_URL = "http://localhost:3001";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role, profileImage, email } = req.body;
        if (!email || !email.trim()) {
            return res.status(400).json({ message: "Email é obrigatório." });
        }
        let assignedPtId = undefined;
        let isValidated = false;
        if (req.user && req.user.role === 'PT' && role === 'CLIENT') {
            assignedPtId = req.user._id;
            isValidated = true;
        }
        else {
            isValidated = role === 'PT' ? false : true;
        }
        const existingUser = yield User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "O nome de utilizador já existe." });
        }
        const existingEmail = yield User_1.User.findOne({ email: email.trim() });
        if (existingEmail) {
            return res.status(400).json({ message: "O email já está registado." });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.User({
            username,
            password: hashedPassword,
            role: role || 'CLIENT',
            profileImage,
            email: email.trim(),
            ptId: assignedPtId,
            isValidated: isValidated
        });
        yield newUser.save();
        const _a = newUser.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
        res.status(201).json(userResponse);
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao registar utilizador." });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        const _a = user.toObject(), { password: _ } = _a, userResponse = __rest(_a, ["password"]);
        res.json({ token, user: userResponse });
    }
    catch (err) {
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});
exports.login = login;
const qrLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { qrToken } = req.body;
    if (qrToken === "valid_qr_code") {
        res.json({ message: "Login por QR Code realizado com sucesso", token: "mock_jwt_token" });
    }
    else {
        res.status(400).json({ message: "Código QR inválido" });
    }
});
exports.qrLogin = qrLogin;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier } = req.body;
        if (!identifier) {
            return res.status(400).json({ message: "Username ou email é obrigatório" });
        }
        const user = yield User_1.User.findOne({
            $or: [
                { username: identifier.trim() },
                { email: identifier.trim() }
            ]
        });
        if (!user) {
            return res.json({
                message: "Se este utilizador existir, receberá um email com instruções para redefinir a senha."
            });
        }
        if (!user.email) {
            return res.status(400).json({
                message: "Este utilizador não tem email registado. Contacte o administrador."
            });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        yield user.save();
        const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
        const emailContent = email_1.emailTemplates.passwordReset(user.username, resetLink);
        yield email_1.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
        });
        res.json({
            message: "Se este utilizador existir, receberá um email com instruções para redefinir a senha."
        });
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao processar pedido." });
    }
});
exports.forgotPassword = forgotPassword;
const validateResetToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = yield User_1.User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                message: "Token inválido ou expirado. Solicite uma nova recuperação de senha."
            });
        }
        res.json({
            valid: true,
            username: user.username
        });
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao validar token." });
    }
});
exports.validateResetToken = validateResetToken;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "A senha deve ter pelo menos 6 caracteres."
            });
        }
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = yield User_1.User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                message: "Token inválido ou expirado. Solicite uma nova recuperação de senha."
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        if (user.email) {
            const emailContent = email_1.emailTemplates.passwordChanged(user.username);
            yield email_1.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text,
            });
        }
        res.json({
            message: "Senha redefinida com sucesso! Pode agora fazer login com a nova senha."
        });
    }
    catch (err) {
        console.error('Erro ao redefinir senha:', err);
        res.status(500).json({ error: "Erro ao redefinir senha." });
    }
});
exports.resetPassword = resetPassword;

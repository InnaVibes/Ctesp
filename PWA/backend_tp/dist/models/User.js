"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'PT', 'CLIENT'], default: 'CLIENT' },
    isValidated: { type: Boolean, default: false },
    ptId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    profileImage: { type: String },
    themePreference: { type: String, enum: ['light', 'dark'], default: 'light' },
    email: { type: String, sparse: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);

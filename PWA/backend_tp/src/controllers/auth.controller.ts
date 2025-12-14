import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const SECRET_KEY = "pwa_secret_key";

export const register = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ _id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user });
};

export const qrLogin = async (req: Request, res: Response) => {
    const { qrToken } = req.body;
    if(qrToken === "valid_qr_code") {
        res.json({ message: "QR Login Successful", token: "mock_jwt_token" });
    } else {
        res.status(400).json({ message: "Invalid QR" });
    }
}
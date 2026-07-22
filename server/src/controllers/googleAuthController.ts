import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';

// Google OAuth callback - handles redirect from Google
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code) {
      res.redirect('http://localhost:5173/login?error=no_code');
      return;
    }

    // Exchange code for tokens with Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code as string,
        client_id: config.googleClientId || '',
        client_secret: config.googleClientSecret || '',
        redirect_uri: 'http://localhost:5000/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json() as any;

    if (!tokenData.access_token) {
      res.redirect('http://localhost:5173/login?error=token_failed');
      return;
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json() as any;

    if (!googleUser.email) {
      res.redirect('http://localhost:5173/login?error=no_email');
      return;
    }

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name || googleUser.email.split('@')[0],
        email: googleUser.email,
        password: Math.random().toString(36).slice(-12),
        role: 'customer',
      });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/shop?token=${token}&user=${encodeURIComponent(JSON.stringify({ _id: user._id, name: user.name, email: user.email, role: user.role }))}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect('http://localhost:5173/login?error=google_failed');
  }
};

// Google OAuth login - accepts credential token from Google (for popup flow)
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ success: false, message: 'Google credential required' });
      return;
    }

    // Decode the JWT token from Google (without verification for demo)
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());

    const { email, name } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-12),
        role: 'customer',
      });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: 'Google login failed' });
  }
};

import "server-only";
import { Account } from "@prisma/client";
import { jwtVerify, SignJWT } from 'jose';
import { ERROR_MESSAGES } from "./constants/messages";

export const ACCESS_TOKEN_NAME = 'accessToken';
export const REFRESH_TOKEN_NAME = 'refreshToken';

// Middleware to generate access tokens
export const generateAccessToken = async (user: Account) => {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  // isUser: user.role.includes('USER') 
  const jwt = await new SignJWT({ accountId: user.id })
    .setProtectedHeader({ alg: String(process.env.HASH_ALGORITHM) })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
  return jwt
};

// Middleware to generate refresh tokens
export const generateRefreshToken = async (user: Account) => {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
  const jwt = await new SignJWT({ accountId: user.id })
    .setProtectedHeader({ alg: String(process.env.HASH_ALGORITHM) })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(secret);
  return jwt
};

// Verify access tokens
export const verifyAccessToken = async (token: any) => {
  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload
  } catch (error) {
    console.log("v",ERROR_MESSAGES.AuthenticationError);
    // console.log("verifyAccessToken", error);
    return null
  }
};

// Verify refresh tokens
export const verifyRefreshToken = async (token: any) => {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload
};


export const generateRandomPassword = (length = 12) => {
  // const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

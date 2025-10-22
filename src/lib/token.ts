
import { db } from "./db";
import { v4 as uuidv4 } from "uuid"; 
import crypto from "crypto";

export const getOtpTokenByEmail = async (email: string) => {
  return db.otpToken.findUnique({
    where: { email },
  });
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  return db.passwordResetToken.findUnique({
    where: { email },
  });
};


export const generateTokenTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString(); 
  // the otp have 5 minute before exp
  const expires = new Date(Date.now() + 5 * 60 * 1000); 
  

  const existingToken = await getOtpTokenByEmail(email);

  if (existingToken) {
    await db.otpToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const otpToken = await db.otpToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return otpToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); 

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // 2. إنشاء رمز جديد
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
import jwt from "jsonwebtoken";

export type JWTToken = {
  id: string;
  userId: string;
  userEmail: string;
};
export const JWTToken = {
  sign: (secret: string, token: JWTToken) => {
    return jwt.sign(token, secret);
  },
  verify: (secret: string, token: string): JWTToken => {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      throw new Error(`Decoded JWT is string, ${decoded}`);
    }

    if (!decoded.id || !decoded.userId || !decoded.userEmail) {
      throw new Error(`Decoded JWT is not fullfilled, ${decoded}`);
    }

    return {
      id: decoded.id,
      userId: decoded.userId,
      userEmail: decoded.userEmail,
    };
  },
};

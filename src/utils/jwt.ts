import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = (userId: number, email: string) => {
  const user = {
    id: userId,
    email,
  };

  return jwt.sign(user, secret, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => jwt.verify(token, secret);

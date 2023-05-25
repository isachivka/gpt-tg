import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== process.env.ACCESS_KEY) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

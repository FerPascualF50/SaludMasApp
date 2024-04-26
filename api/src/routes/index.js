import express from "express";
import { userRouter } from "./user.routes.js";
import { userAuthRouter } from "./user_auth.routes.js";
import { invoiceRouter } from "./invoice.routes.js";
import { authMiddleware } from "../utils/middlewares.js";


export const router = express.Router();
router
	.use("/user", authMiddleware, userRouter)
  .use("/auth", userAuthRouter)
	.use("/invoice", authMiddleware, invoiceRouter);
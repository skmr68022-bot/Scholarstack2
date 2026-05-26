import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import paymentRouter from "./payment";
import notesRouter from "./notes";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(paymentRouter);
router.use(notesRouter);
router.use(uploadRouter);

export default router;

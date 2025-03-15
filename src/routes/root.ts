import { Router } from "express";
import session from "express-session";
import spawnJupyter from "../utils/spawnJupyter";
import 'dotenv/config'

interface Session extends session.SessionData {
  containerPort?: number;
}

const router = Router();
router.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

router.get("/", async (req, res) => {
  if (!("containerPort" in req.session)) {
    (req.session as Session).containerPort = await spawnJupyter();
  }
  const redirectPort = (req.session as Session).containerPort;
  const redirectTo = `http://${process.env.HOSTNAME}:${redirectPort}/?token=token`;
  res.redirect(redirectTo);
});

export default router;

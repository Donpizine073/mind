import express from "express";
import crypto from "node:crypto";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const DESTINATION_URL = process.env.DESTINATION_URL;

if (!DESTINATION_URL) {
  throw new Error("DESTINATION_URL must be configured");
}

const tokens = new Map();

app.post("/api/redirect-token", (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 60_000;

  tokens.set(token, {
    expiresAt,
    used: false,
  });

  res.json({
    redirectUrl: `/api/redirect/${token}`,
  });
});

app.get("/api/redirect/:token", (req, res) => {
  const record = tokens.get(req.params.token);

  if (!record || record.used || Date.now() > record.expiresAt) {
    return res.status(403).send("Invalid or expired redirect token");
  }

  record.used = true;
  tokens.delete(req.params.token);

  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");

  return res.redirect(302, DESTINATION_URL);
});

app.listen(PORT, () => {
  console.log(`Redirect server listening on port ${PORT}`);
});
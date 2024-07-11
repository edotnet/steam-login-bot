const express = require("express");
const CommunityAdapter = require("./steam-community-adapter");

const app = express();
const port = process.env.PORT || 3000;
const appSecret = process.env.APP_SECRET;
const adapter = new CommunityAdapter(
  process.env.STEAM_USERNAME,
  process.env.STEAM_PASSWORD
);

app.get("/", async function (req, res) {
  if (req.headers["app-secret"] !== appSecret) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const [sessionId, steamLoginSecure] = await adapter.getCredentials();

  res.json({
    sessionId,
    steamLoginSecure,
  });
});

app.listen(port);

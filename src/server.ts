import express from "express";
import { add } from "./index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the platformer from /public
app.use(express.static("public"));

app.get("/api", (_req, res) => {
  res.json({
    message: process.env.APP_GREETING ?? "Hello from default",
    sumExample: add(2, 3)
  });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;

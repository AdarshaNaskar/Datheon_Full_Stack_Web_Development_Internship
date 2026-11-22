import "dotenv/config";
import express from "express";
import cors from "cors";
import weatherRoutes from "./routes/weather.js";

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());
app.use("/api/weather", weatherRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

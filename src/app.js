import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import getSwaggerOptions from "./docs/config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import sceneRoutes from "./routes/sceneRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import realtimeRoutes from "./routes/realtimeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import diceRoutes from "./routes/diceRoutes.js";
import distanceRoutes from "./routes/distanceRoutes.js";
import distanceRoutes from "./routes/distanceRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/scenes", sceneRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/realtime", realtimeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/dice", diceRoutes);
app.use("/api/distance", distanceRoutes);
app.use("/api/distance", distanceRoutes);

// Swagger na raiz
const swaggerOptions = getSwaggerOptions();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
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
import characterSheetRoutes from "./routes/characterSheetRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import diceMacroRoutes from "./routes/diceMacroRoutes.js";
import musicRoutes from "./routes/musicRoutes.js";
import campaignExportRoutes from "./routes/campaignExportRoutes.js";

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
app.use("/api/character-sheets", characterSheetRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/dice-macros", diceMacroRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/campaigns", campaignExportRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Swagger documentation
const swaggerOptions = getSwaggerOptions();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
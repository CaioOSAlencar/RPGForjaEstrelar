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

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/auth", authRoutes);
app.use("/campaigns", campaignRoutes);
app.use("/scenes", sceneRoutes);
app.use("/tokens", tokenRoutes);
app.use("/realtime", realtimeRoutes);
app.use("/chat", chatRoutes);

// Swagger na raiz
const swaggerOptions = getSwaggerOptions();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
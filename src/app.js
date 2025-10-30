import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import getSwaggerOptions from "./docs/config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/auth", authRoutes);
app.use("/campaigns", campaignRoutes);

// Swagger na raiz
const swaggerOptions = getSwaggerOptions();
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./docs/config/swagger.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/auth", authRoutes);

// Rota básica
app.get("/", (req, res) => {
  res.json({ 
    message: "🎲 RPG Forja Estrelar - API funcionando!",
    endpoints: {
      health: "/health",
      register: "POST /auth/register",
      login: "POST /auth/login",
      docs: "/"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
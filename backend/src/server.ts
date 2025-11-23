import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger"
import taskRoutes from "./routes/taskRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import userRoutes from "./routes/userRoutes"

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Routes
app.use("/api/tasks", taskRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`)
  console.log(`[v0] API Documentation: http://localhost:${PORT}/api-docs`)
})

export default app

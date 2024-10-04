import tradeRoutes from "./routes/tradeRoutes"
import express from 'express';
import {errorHandler} from "./middleware/errorHandler"

/**
 * Sets up the Express application, defining routes and applying middlewares.
 */
const app=express()

app.use("/api",tradeRoutes)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
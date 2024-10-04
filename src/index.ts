import tradeRoutes from "./routes/tradeRoutes"
import express from 'express';
import {errorHandler} from "./middleware/errorHandler"

const app=express()

app.use("/api",tradeRoutes)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import tradeRoutes from "./routes/tradeRoutes"
import express from 'express';

const app=express()

app.use("/api",tradeRoutes)

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from "express";
import rootRouter from "./routes/root";

const app = express();
app.use("/", rootRouter);

app.listen(3000, () => console.log(`listening on ${3000}`));

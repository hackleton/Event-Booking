require("dotenv").config({ path: ".env" });
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app: Express = express();
const PORT: string = process.env.NODE_PORT!;
const DB: string = process.env.MONGO_DB!;
const http: string = process.env.PORT_HTTP!;
const host: string = process.env.PORT_HOST!;

// app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
// app.use(bodyParser.json());


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(routes);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.set("debug", true);
mongoose
  .connect(`mongodb://${host}/${DB}`, options)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on ${http}://${host}:${PORT}`)
    )
  )
  .catch((error) => {
    throw error;
  });


  
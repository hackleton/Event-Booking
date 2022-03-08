"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: ".env" });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env.NODE_PORT;
const DB = process.env.MONGO_DB;
const http = process.env.PORT_HTTP;
const host = process.env.PORT_HOST;
// app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
// app.use(bodyParser.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose_1.default.set("debug", true);
mongoose_1.default
    .connect(`mongodb://${host}/${DB}`, options)
    .then(() => app.listen(PORT, () => console.log(`Server running on ${http}://${host}:${PORT}`)))
    .catch((error) => {
    throw error;
});

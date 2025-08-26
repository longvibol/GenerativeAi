// index.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const setupSwagger = require("./swagger");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/", routes);

setupSwagger(app); // Swagger UI mounted at /api-docs

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

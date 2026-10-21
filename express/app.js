const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
const googleRoutes = require("./routes/googleRoutes");
// const openAiRoutes = require("./routes/openAiRoutes");
const groqAiRoutes = require("./routes/groqAiRoutes");
app.use("/api/auth", googleRoutes);
// app.use("/api", openAiRoutes);
app.use("/api", groqAiRoutes);

app.listen(PORT, () => {
  console.log(`The server started on http://localhost:${PORT}`);
});

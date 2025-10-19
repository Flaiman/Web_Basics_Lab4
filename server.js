require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const imageRoutes = require("./routes/imageRoutes");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/images", imageRoutes);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const { MySQLConPool } = require("./config/db");
const app = express();
const cors = require('cors');
require('dotenv').config();

const userRoutes = require("./routes/userRoutes");

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json()); //which automatically parses incoming JSON strings in the request body
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/users", userRoutes);

app.use("/", (req, res) => {
  res.send("Welcome to the LaFlora");
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send({ error: 'Internal server error' });
});


//SERVER
const PORT = 8080;

app.listen(PORT, async () => {

  try {
    await MySQLConPool
    console.log("connected to database");
  } catch (error) {
    console.log("error connect to db", error);
  }
  console.log(`Express server running on port - ${PORT}`);
})





/**app.use(express.json());
 * which automatically parses incoming JSON strings in the request body into JavaScript objects. 
 * When the server receives the JSON string (e.g., {"name":"John","phone":"1234567890","email":"john@example.com"}), the express.json() middleware parses it into req.body as { name: "John", phone: "1234567890", email: "john@example.com" }.
 */
const http = require("http");
const express = require("express");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const server = http.createServer();
const app = express();
app.use(express.json());

const connectionString = "mongodb://localhost:27017";

async function init() {
  const client = new MongoClient(connectionString, {
    useUnifiedTopology: true,
  });

  await client.connect();

  app.get("/", async (req, res) => {
    const db = client.db("adoption");
    const collection = db.collection("pets");

    const pets = await collection
      .find(
        {
          $text: {
            $search: req.query.search,
          },
        },
        { _id: false }
      )
      .sort({ score: { $meta: "textSore" } })
      .limit(10)
      .toArray();

    res.json({ status: "ok", pets }).end();
  });
}

init();

app.post("/users", (req, res) => {
  if (!req.body || Object.keys(req.body) === 0) {
    return res.status(400).json({ message: "empty field not allowed" });
  }
  try {
    fs.writeFileSync("users.json", JSON.stringify(req.body, null, 2));
    res.status(201).json({ message: "new user added", user: req.body });
  } catch (err) {
    res.status(500).json({ message: "unable to save new user" });
  }
});

app.get("/users", (req, res) => {
  try {
    const data = fs.readFileSync("users.json");
    const users = JSON.parse(data);
    res.json(users);
    console.log(users);
  } catch (err) {
    res.status(500).json({ message: "unable to read users" });
    console.log(res.status(500));
  }
});

server.on("request", app);

server.listen(4000, () => {
  console.log("node is listening on port 4000");
});

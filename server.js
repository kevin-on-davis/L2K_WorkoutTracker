var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

const databaseUrl = "workoutDB";
const collections = ["userProfile"];

const db = mongojs(databaseUrl, collections);

db.createCollection("workoutUser", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "gender"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        age: {
          bsonType: "int",
          description: "must be an integer and is required"
        },
        gender: {
          enum: ["Male", "Female", null],
          description: "can only be one of the enum values and is required"
        }
      }
    }
  },
  workouts: [
    {
      exercises: []
    }
  ]
});

db.on("error", error => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);

  db.notes.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

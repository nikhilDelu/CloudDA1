import express, { json } from "express";
import { connect, Schema, model } from "mongoose";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
app.use(json());
app.use(cors({
  origin: "https://cloudda1client.vercel.app/",
}));
app.use(cors({
    origin: 'https://your-vercel-frontend-domain.vercel.app', // Replace with your actual Vercel domain
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));

connect(
  "mongodb+srv://projectyjka:53yjka21@asciicluster0.pgohfwc.mongodb.net/cloudda1DB"
)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

// ToDo Model
const todoSchema = new Schema({
  text: String,
  completed: Boolean,
});
const Todo = model("Todo", todoSchema);

// API routes
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.status(201).json(todos);
});

app.post("/todos", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: false,
  });
  await newTodo.save();
  res.status(200).json(newTodo);
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

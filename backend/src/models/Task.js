import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    movieName: {
      type: String,
      required: true
    },
    cinema: {
      type: String,
      required: true
    },
    seats: [
      {
        type: String
      }
    ],
    showTime: {
      type: Date,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);
const Task = mongoose.model("Task", taskSchema);

export default Task;
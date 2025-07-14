// import mongoose from "mongoose";
// const ExpenseSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User", // 👈 Reference to the User model
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   tags: {
//     type: [String],
//   },
// });

// const ExpenseModel = mongoose.model("Expense",ExpenseSchema)

// export default ExpenseModel


import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number, // changed to Number
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // changed to Date
    required: true,
  },
  tags: {
    type: [String], // changed to array of strings (optional)
  },
});

const ExpenseModel = mongoose.model("Expense", ExpenseSchema);

export default ExpenseModel;

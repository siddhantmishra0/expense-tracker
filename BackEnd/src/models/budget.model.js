import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number, // changed to Number
    required: true,
  },
  category: {
    type: String,
    required: true,
    unique: true
  },
});

const BudgetModel = mongoose.model("Budget", BudgetSchema);

export default BudgetModel;

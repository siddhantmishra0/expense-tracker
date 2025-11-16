import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Entertainment",
        "Health",
        "Education",
        "Other",
        "Overall",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Compound index: ensures each user can have unique categories
BudgetSchema.index({ userId: 1, category: 1 }, { unique: true });

const BudgetModel = mongoose.model("Budget", BudgetSchema);

export default BudgetModel;

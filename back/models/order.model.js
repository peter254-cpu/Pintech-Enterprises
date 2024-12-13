import mongoose from "mongoose";

// Define the order schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Quantity must be at least 1
        },
        price: {
          type: Number,
          required: true,
          min: 0, // Price must be non-negative
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Total amount must be non-negative
    },
    stripeSessionId: {
      type: String,
      unique: true, // Ensure stripeSessionId is unique to prevent duplicates
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Order model from the schema
const Order = mongoose.model("Order", orderSchema);

export default Order;

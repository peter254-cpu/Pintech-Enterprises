import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  couponIsApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons")
      set({ coupon: response.data })
    } catch (error) {
      console.log("Error fetching coupon", error)
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", {code});
      set({coupon: response.data, couponIsApplied: true})
      get().calculateTotals();
      toast.success("Coupon applied successfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon ")
    }
  },
  
  removeCoupon: () => {
    set({ coupon: null, couponIsApplied: false})
    get().calculateTotals()
    toast.success("Coupon removed")
  },

  // Function to get cart items from the server
  getCartItems: async () => {
    try {
      // Send a GET request to the server to fetch cart items
      const res = await axios.get("/cart");
      // Update the state with the fetched cart items
      set({ cart: res.data });
      console.log(res.data);
      // Calculate the totals after updating the cart
      get().calculateTotals();
    } catch (error) {
      // Handle errors by setting the cart to an empty array and showing an error message
      set({ cart: [] });
      console.log(error);
      toast.error(error.response.data.message || "Error while getting cart items");
    }
  },

  // Function to add a product to the cart
  addToCart: async (product) => {
    try {
      // Send a POST request to the server to add the product to the cart
      await axios.post("/cart/add-to-cart", { productId: product._id });

      // Update the local state with the new cart contents
      set((prevState) => {
        // Find if the product already exists in the cart
        const existingItem = prevState.cart.find((item) => item._id === product._id);

        // If the product exists, increase its quantity; otherwise, add it to the cart
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        // Calculate the totals after updating the cart
        get().calculateTotals();
        // Return the updated cart state
        return { cart: newCart };
      });
    } catch (error) {
      // Handle errors by showing an error message and not altering the cart state
      toast.error(error.response?.data?.message || "Error occurred while adding to cart");
      console.log(error);
    }
  },

  // Function to calculate totals
  calculateTotals: () => {
    // Get the current state, including the cart and any applied coupon
    const { cart, coupon } = get();
    // Calculate the subtotal by summing up the price * quantity for each item in the cart
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Initialize the total to the subtotal
    let total = subtotal;
    // If there's a coupon, calculate the discount and subtract it from the subtotal to get the total
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    // Update the state with the new subtotal and total
    set({ subtotal, total });
  },

  // Function to remove an item from the cart
  removeFromCart: async (productId) => {
    try {
      // Send a DELETE request to the server to remove the item from the cart
      await axios.delete(`/cart/delete-from-cart/${productId}`);
      // Update the local state to remove the item from the cart
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId)
      }));
      // Recalculate the totals after removing the item
      get().calculateTotals();
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while removing from cart");
    }
  },

  // Function to update the quantity of an item in the cart
  updateQuantity: async (productId, quantity) => {
    try {
      // If the quantity is 0, remove the item from the cart
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }
      // Send a PUT request to update the quantity of the item in the cart
      await axios.put(`/cart/update/${productId}`, { quantity });
      // Update the local state to reflect the new quantity
      set((prevState) => ({
        cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item))
      }));
      // Recalculate totals after updating the quantity
      get().calculateTotals();
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while updating quantity");
    }
  },

  // Function to clear the cart
  clearCart: async () => {
    try {
      // Clear the cart and reset coupon, total, and subtotal
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
      console.log("clear cart function run");
    } catch (error) {
      console.log("Error clearing the cart", error);
    }
  }
}));

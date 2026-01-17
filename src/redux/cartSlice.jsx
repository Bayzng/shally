import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  try {
    const cart = localStorage.getItem("cart");

    // If cart is null, undefined, or "undefined"
    if (!cart || cart === "undefined") {
      return [];
    }

    return JSON.parse(cart);
  } catch (error) {
    console.error("Invalid cart data in localStorage. Resetting cart.");
    localStorage.removeItem("cart");
    return [];
  }
};

const initialState = getInitialCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.push(action.payload);
    },

    deleteFromCart(state, action) {
      return state.filter((item) => item.id !== action.payload.id);
    },

    clearCart() {
      return [];
    },
  },
});

export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id && i.size === item.size);
      if (existing) {
        existing.qty += item.qty;
      } else {
        state.items.push(item);
      }
    },
   removeFromCart: (state, action) => {
  const { id, size } = action.payload;
  state.items = state.items.filter(i => !(i.id === id && i.size === size));
},

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

import { create } from 'zustand';

// Define the type for a single cart item
type CartItemType = {
  id: number;             // Unique identifier for the item
  title: string;          // Title or name of the item
  heroImage: string;      // URL for the item's image
  price: number;          // Price of the item
  quantity: number;       // Quantity of the item in the cart
  maxQuantity: number;    // Maximum quantity allowed for the item
};

// Define the type for the cart state
type CartState = {
  items: CartItemType[];                   // Array of items in the cart
  addItem: (item: CartItemType) => void;   // Function to add an item to the cart
  removeItem: (id: number) => void;        // Function to remove an item from the cart by ID
  incrementItem: (id: number) => void;     // Function to increase the quantity of an item by ID
  decrementItem: (id: number) => void;     // Function to decrease the quantity of an item by ID
  getTotalPrice: () => string;             // Function to calculate the total price of the cart
  getItemCount: () => number;              // Function to calculate the total item count in the cart
  resetCart: () => void;                   // Function to reset the cart to its initial state
};

// Initial cart items set as an empty array
const initialCartItems: CartItemType[] = [];

// Create the cart store using Zustand
export const useCartStore = create<CartState>((set, get) => ({
  // Initialize the store with the initial items
  items: initialCartItems,

  // Function to add an item to the cart
  addItem: (item: CartItemType) => {
    // Check if the item already exists in the cart
    const existingItem = get().items.find(i => i.id === item.id);
    if (existingItem) {
      // If the item already exists, update its quantity but respect the maximum allowed
      set(state => ({
        items: state.items.map(i =>
          i.id === item.id
            ? {
                ...i,
                // New quantity is the smaller value between the intended quantity and the max quantity
                quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
              }
            : i
        ),
      }));
    } else {
      // If the item is not present, simply add it to the cart
      set(state => ({ items: [...state.items, item] }));
    }
  },

  // Function to remove an item from the cart by its ID
  removeItem: (id: number) =>
    set(state => ({
      // Filter out the item to be removed, retaining others
      items: state.items.filter(item => item.id !== id)
    })),

  // Function to increment the quantity of an item, within max quantity limits
  incrementItem: (id: number) =>
    set(state => {
      return {
        items: state.items.map(item =>
          // Check if the item ID matches and the current quantity is less than allowed max
          item.id === id && item.quantity < item.maxQuantity
            ? { ...item, quantity: item.quantity + 1 } // Increment quantity
            : item // Return unchanged item if conditions not met
        ),
      };
    }),

  // Function to decrement the quantity of an item, ensuring it doesn't go below 1
  decrementItem: (id: number) =>
    set(state => ({
      items: state.items.map(item =>
        // Check if the item ID matches and the quantity is greater than 1
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } // Decrement quantity
          : item // Return unchanged item if conditions not met
      ),
    })),

  // Function to calculate the total price of all items in the cart
  getTotalPrice: () => {
    const { items } = get(); // Retrieve current list of items
    return items
      // Reduce items to a total price, summing up the price multiplied by quantity for each item
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2); // Format the result to 2 decimal places
  },

  // Function to calculate the total number of items in the cart
  getItemCount: () => {
    const { items } = get(); // Retrieve current list of items
    // Reduce all items to a total count, summing their quantities
    return items.reduce((count, item) => count + item.quantity, 0);
  },

  // Function to reset the cart to its initial empty state
  resetCart: () => set({ items: initialCartItems }), // Reset items to initial state
}));

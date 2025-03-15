// Cart functionality for Astro
// This file provides cart functionality similar to the SvelteKit implementation

// Define the CartItem interface
export class CartItem {
  constructor(
    id,
    name,
    quantity,
    isffl,
    image,
    price,
    totalprice,
    customerid = 0,
    addshipping = 0,
    specialtax = 0,
    freeship = false,
    selectedOptions = undefined
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.isffl = isffl;
    this.image = image;
    this.price = price;
    this.totalprice = totalprice;
    this.customerid = customerid;
    this.addshipping = addshipping;
    this.specialtax = specialtax;
    this.freeship = freeship;
    this.selectedOptions = selectedOptions;
  }
}

// Create a simple store implementation for Astro
class Store {
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.value);
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  update(updater) {
    this.value = updater(this.value);
    this.subscribers.forEach(callback => callback(this.value));
  }

  set(newValue) {
    this.value = newValue;
    this.subscribers.forEach(callback => callback(this.value));
  }

  get() {
    return this.value;
  }
}

// Create a derived store
function derived(store, deriveFn) {
  const derivedStore = new Store(deriveFn(store.value));
  
  store.subscribe(value => {
    derivedStore.set(deriveFn(value));
  });
  
  return derivedStore;
}

// Initialize cart items store
export const cartItems = new Store([]);

// Helper function to fetch product by ID
const fetchProductbyID = async (id) => {
  try {
    const response = await fetch(`/api/product/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Helper function to calculate option prices
const calculateOptionPrice = (selectedOptions) => {
  if (!selectedOptions) return 0;
  
  return Object.values(selectedOptions).reduce((sum, option) => {
    // For simple addons, use the price field
    if (option.isSimpleAddon) {
      return sum + (Number(option.price) || 0);
    }
    // For other options, use the optionprice field
    return sum + (Number(option.optionprice) || 0);
  }, 0);
};

// Add to cart with options
export const addToCartWithOptions = async (id, selectedOptions) => {
  try {
    const response = await fetchProductbyID(id);
    const productData = response.product;

    if (!productData) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const basePrice = Number(productData.productprice);
    const optionsPrice = calculateOptionPrice(selectedOptions);
    const totalPricePerItem = basePrice + optionsPrice;

    const newItem = new CartItem(
      id,
      productData.productname,
      1,
      productData.isffl,
      productData.productimage,
      basePrice,
      totalPricePerItem,
      0,
      productData.addshipping || 0,
      productData.specialtax || 0,
      productData.freeship || false,
      selectedOptions
    );

    cartItems.update((items) => {
      const itemPosition = items.findIndex((item) => {
        if (!selectedOptions) {
          return item.id === id && !item.selectedOptions;
        }
        return item.id === id && 
               JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions);
      });

      if (itemPosition !== -1) {
        // Update existing item
        const updatedItems = items.map((item, index) => {
          if (index === itemPosition) {
            const newQuantity = item.quantity + 1;
            const itemOptionsPrice = calculateOptionPrice(item.selectedOptions);
            const itemTotalPrice = (item.price + itemOptionsPrice) * newQuantity;
            
            return {
              ...item,
              quantity: newQuantity,
              totalprice: itemTotalPrice
            };
          }
          return item;
        });
        return updatedItems;
      } else {
        return [...items, newItem];
      }
    });
  } catch (error) {
    console.error("Error while adding to cart:", error);
  }
};

// Add to cart without options
export const addToCart = async (id) => {
  try {
    const response = await fetchProductbyID(id);
    const productData = response.product;

    if (!productData) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const basePrice = Number(productData.productprice);

    const newItem = new CartItem(
      id,
      productData.productname,
      1,
      productData.isffl,
      productData.productimage,
      basePrice,
      basePrice,
      0,
      productData.addshipping || 0,
      productData.specialtax || 0,
      productData.freeship || false
    );

    cartItems.update((items) => {
      const itemPosition = items.findIndex((item) => 
        item.id === id && !item.selectedOptions
      );

      if (itemPosition !== -1) {
        const updatedItems = items.map((item) => {
          if (item.id === id && !item.selectedOptions) {
            const newQuantity = item.quantity + 1;
            return { 
              ...item, 
              quantity: newQuantity,
              totalprice: item.price * newQuantity
            };
          }
          return item;
        });
        return updatedItems;
      } else {
        return [...items, newItem];
      }
    });
  } catch (error) {
    console.error("Error while adding to cart:", error);
  }
};

// Remove one item from cart
export const removeFromCart = (id, selectedOptions) => {
  cartItems.update((items) => {
    const updatedItems = items.map((item) => {
      const matchesItem = item.id === id;
      const matchesOptions = selectedOptions 
        ? JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
        : !item.selectedOptions;

      if (matchesItem && matchesOptions) {
        const newQuantity = Math.max(0, item.quantity - 1);
        const itemOptionsPrice = calculateOptionPrice(item.selectedOptions);
        const newTotalPrice = (item.price + itemOptionsPrice) * newQuantity;
        
        return { 
          ...item, 
          quantity: newQuantity,
          totalprice: newTotalPrice
        };
      }
      return item;
    });
    return updatedItems.filter((item) => item.quantity > 0);
  });
};

// Delete item from cart completely
export const deleteFromCart = (id, selectedOptions) => {
  cartItems.update((items) => {
    return items.filter((item) => {
      if (selectedOptions) {
        return !(item.id === id && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions));
      }
      return !(item.id === id && !item.selectedOptions);
    });
  });
};

// Calculate cart total
export const cartTotal = derived(cartItems, (items) => {
  return items.reduce((total, item) => {
    const itemOptionsPrice = calculateOptionPrice(item.selectedOptions);
    const itemTotalPrice = (item.price + itemOptionsPrice) * item.quantity;
    return total + itemTotalPrice;
  }, 0);
});

// Calculate cart count
export const cartCount = derived(cartItems, (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
});

// Helper function to calculate total price including options
export const calculateItemTotalPrice = (item) => {
  let itemTotal = item.price * item.quantity;
  
  if (item.selectedOptions) {
    Object.values(item.selectedOptions).forEach(option => {
      if (option.isSimpleAddon) {
        itemTotal += Number(option.price || 0) * item.quantity;
      } else {
        itemTotal += Number(option.optionprice || 0) * item.quantity;
      }
    });
  }
  
  return itemTotal;
};

// Load cart from localStorage
export const loadCart = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        cartItems.set(parsedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }
};

// Save cart to localStorage
export const saveCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cartItems.get()));
  }
};

// Initialize cart by loading from localStorage
if (typeof window !== 'undefined') {
  loadCart();
  
  // Save cart whenever it changes
  cartItems.subscribe(() => {
    saveCart();
  });
}
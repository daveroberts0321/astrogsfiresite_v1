import { e as createComponent, r as renderTemplate, k as defineScriptVars, m as maybeRenderHead, f as createAstro, h as addAttribute, l as renderHead, i as renderComponent, n as renderSlot, j as renderScript, u as unescapeHTML, o as Fragment } from './astro/server_Yi5bUcOU.mjs';
import 'kleur/colors';
/* empty css                                */
import fetch from 'node-fetch';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import 'clsx';

// .env file
dotenv.config();
// Get environment variables
const REDIS = process.env.REDIS;
const FORTIS_ENV = process.env.FORTIS_ENV;
const STORENUMBER = process.env.STORENUMBER;

let baseUrl = "https://gunstorewebsite.com";
let baseTime = 30; // 600 seconds = 10 minutes
if (FORTIS_ENV === "sandbox") {
  baseUrl = "http://localhost:3000"; 
  baseTime = 30; // 30 seconds for sandbox environment
}

let redisClient;
try {
  if (REDIS) {
    const redisUrl = new URL(REDIS);
    const redisOptions = {
      host: redisUrl.hostname,
      port: parseInt(redisUrl.port),
      password: redisUrl.password,
    };
    redisClient = new Redis(redisOptions);
  } else {
    console.log("Redis URL not provided.");
  }
} catch (error) {
  console.error('Error setting up Redis:', error);
}

const cacheData = async (cacheKey, fetchDataFunction) => {
  if (!redisClient) {
    console.log(`Redis client not available. Fetching data for ${cacheKey} directly.`);
    return await fetchDataFunction();
  }
  
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const data = await fetchDataFunction();
      await redisClient.setex(cacheKey, baseTime, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error(`Error accessing Redis cache for ${cacheKey}:`, error);
    return await fetchDataFunction();
  }
};

// Fetch store data
const fetchStore = async () => {
  try {
    const url = `${baseUrl}/apistore_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch store data');
    return JSON.parse(await response.text());
  } catch (error) {
    console.error('Error fetching store data:', error);
    return { store: { storename: 'GSFire', city: 'Demo City', state: 'ST' } };
  }
};

/* Fetch carousel images data
export const fetchCarouselImages = async () => {
  try {
    const url = `${baseUrl}/apicarouselimages_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch carousel images');
    return JSON.parse(await response.text());
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return [];
  }
};
*/

// Fetch categories data
const fetchCategories = async () => {
  try {
    const url = `${baseUrl}/apicategory_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = JSON.parse(await response.text());
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch featured products data
const fetchFeaturedProducts = async () => {
  try {
    const url = `${baseUrl}/apifeaturedproducts_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    const data = JSON.parse(await response.text());
    //console.log('Featured products data structure:', data);
    if (data.products && data.products.length > 0) {
      const firstProduct = data.products[0];
      //console.log('First featured product example:', firstProduct);
      //console.log('Available fields:', Object.keys(firstProduct));
      //console.log('Stock fields:', {
      //  inventory: firstProduct.inventory,
      //  productstock: firstProduct.productstock,
      //  stock: firstProduct.stock
      //});
    }
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Fetch blog posts data
const fetchBlogPosts = async () => {
  try {
    const url = `${baseUrl}/lastfourblogposts_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    const data = JSON.parse(await response.text());
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

const storeData = await cacheData('storeData', fetchStore);
//export const carouselData = await cacheData('carouselData', fetchCarouselImages);
const categoriesData = await cacheData('categoriesData', fetchCategories);
const productsData = await cacheData('productsData', fetchFeaturedProducts);
const blogPostsData = await cacheData('blogPostsData', fetchBlogPosts);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$CartComponent = createComponent(async ($$result, $$props, $$slots) => {
  const storeInfo = await storeData;
  const store = {
    storename: storeInfo.store.storename,
    freeship: storeInfo.store.freeship ? true : false,
    statetax: storeInfo.store.statetax || 0,
    localtax: storeInfo.store.localtax || 0,
    taxshipping: storeInfo.store.taxshipping ? true : false,
    shiprate: storeInfo.store.shiprate || 0
  };
  return renderTemplate(_a || (_a = __template(["<!-- Cart Sidebar -->", '<div id="cart-sidebar" class="fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out z-50"> <div class="flex flex-col h-full"> <!-- Cart Header --> <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"> <h2 class="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2> <button id="close-cart" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <!-- Cart Items --> <div id="cart-items" class="flex-grow overflow-y-auto p-4"> <!-- Cart items will be dynamically inserted here --> <div class="text-center text-gray-500 dark:text-gray-400 py-8" id="empty-cart-message">\nYour cart is empty\n</div> </div> <!-- Cart Summary --> <div class="border-t border-gray-200 dark:border-gray-700 p-4"> <div class="space-y-2 mb-4"> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Subtotal</span> <span id="cart-subtotal" class="font-medium text-gray-900 dark:text-white">$0.00</span> </div> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Tax</span> <span id="cart-tax" class="font-medium text-gray-900 dark:text-white">$0.00</span> </div> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Shipping</span> <span id="cart-shipping" class="font-medium text-gray-900 dark:text-white">$0.00</span> </div> <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700"> <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span> <span id="cart-total" class="text-lg font-bold text-gray-900 dark:text-white">$0.00</span> </div> </div> <a href="/checkout" id="checkout-button" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-semibold transition text-center opacity-50 cursor-not-allowed" aria-disabled="true">\nProceed to Checkout\n</a> </div> </div> </div> <!-- Cart Overlay --> <div id="cart-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div> <script>(function(){', `
  // Cart functionality
  document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    
    // Store data for calculations
    const storeData = {
      freeship: storeFreeship,
      statetax: storeStateTax,
      localtax: storeLocalTax,
      taxshipping: storeTaxShipping,
      shiprate: storeShipRate
    };
    
    // Open cart function
    function openCart() {
      if (cartSidebar) {
        cartSidebar.classList.remove('translate-x-full');
      }
      if (cartOverlay) {
        cartOverlay.classList.remove('hidden');
      }
      document.body.classList.add('overflow-hidden');
    }
    
    // Make openCart available globally
    window.openCart = openCart;
    
    // Close cart function
    function closeCart() {
      if (cartSidebar) {
        cartSidebar.classList.add('translate-x-full');
      }
      if (cartOverlay) {
        cartOverlay.classList.add('hidden');
      }
      document.body.classList.remove('overflow-hidden');
    }
    
    // Event listeners
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCart);
    }
    
    // Listen for cart toggle events
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest('.cart-toggle')) {
        openCart();
      }
    });
    
    // Render cart
    function renderCart() {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      // Show/hide empty cart message
      if (!cartItemsContainer || !emptyCartMessage || !checkoutButton) return;
      
      if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        checkoutButton.setAttribute('aria-disabled', 'true');
        checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
        cartItemsContainer.innerHTML = '';
        updateCartTotals(0, 0, 0, 0);
        return;
      }
      
      emptyCartMessage.classList.add('hidden');
      checkoutButton.setAttribute('aria-disabled', 'false');
      checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
      
      // Clear cart items container
      cartItemsContainer.innerHTML = '';
      
      // Calculate subtotal
      let subtotal = 0;
      
      // Render each cart item
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-start py-4 border-b border-gray-200 dark:border-gray-700 last:border-0';
        itemElement.innerHTML = \`
          <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <img src="\${item.image}" alt="\${item.name}" class="h-full w-full object-cover object-center">
          </div>
          <div class="ml-4 flex flex-1 flex-col">
            <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
              <h3>
                <a href="/product_\${item.id}">\${item.name}</a>
              </h3>
              <p class="ml-4">$\${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="flex items-center mt-2">
              <button class="decrement-item text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-index="\${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <span class="mx-2 text-gray-700 dark:text-gray-300">\${item.quantity}</span>
              <button class="increment-item text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-index="\${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="remove-item ml-auto text-red-500 hover:text-red-700" data-index="\${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        \`;
        
        cartItemsContainer.appendChild(itemElement);
      });
      
      // Calculate tax and shipping
      const tax = calculateTax(subtotal);
      const shipping = calculateShipping(subtotal);
      const total = subtotal + tax + shipping;
      
      // Update cart totals
      updateCartTotals(subtotal, tax, shipping, total);
      
      // Add event listeners to cart item buttons
      addCartItemEventListeners();
    }
    
    // Calculate tax
    function calculateTax(subtotal) {
      const taxRate = (parseFloat(storeData.statetax.toString()) + parseFloat(storeData.localtax.toString())) / 100;
      let taxableAmount = subtotal;
      
      // If shipping is taxable, add it to the taxable amount
      if (storeData.taxshipping) {
        const shipping = calculateShipping(subtotal);
        taxableAmount += shipping;
      }
      
      return taxableAmount * taxRate;
    }
    
    // Calculate shipping
    function calculateShipping(subtotal) {
      // Free shipping if enabled and subtotal is greater than 0
      if (storeData.freeship && subtotal > 0) {
        return 0;
      }
      
      // Return shipping rate if subtotal is greater than 0
      return subtotal > 0 ? parseFloat(storeData.shiprate.toString()) : 0;
    }
    
    // Update cart totals
    function updateCartTotals(subtotal, tax, shipping, total) {
      if (cartSubtotal) cartSubtotal.textContent = \`$\${subtotal.toFixed(2)}\`;
      if (cartTax) cartTax.textContent = \`$\${tax.toFixed(2)}\`;
      if (cartShipping) cartShipping.textContent = \`$\${shipping.toFixed(2)}\`;
      if (cartTotal) cartTotal.textContent = \`$\${total.toFixed(2)}\`;
    }
    
    // Add event listeners to cart item buttons
    function addCartItemEventListeners() {
      // Increment item quantity
      document.querySelectorAll('.increment-item').forEach(button => {
        button.addEventListener('click', () => {
          const indexAttr = button.getAttribute('data-index');
          if (indexAttr) {
            const index = parseInt(indexAttr);
            incrementCartItem(index);
          }
        });
      });
      
      // Decrement item quantity
      document.querySelectorAll('.decrement-item').forEach(button => {
        button.addEventListener('click', () => {
          const indexAttr = button.getAttribute('data-index');
          if (indexAttr) {
            const index = parseInt(indexAttr);
            decrementCartItem(index);
          }
        });
      });
      
      // Remove item
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
          const indexAttr = button.getAttribute('data-index');
          if (indexAttr) {
            const index = parseInt(indexAttr);
            removeCartItem(index);
          }
        });
      });
    }
    
    // Increment cart item quantity
    function incrementCartItem(index) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
    
    // Decrement cart item quantity
    function decrementCartItem(index) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart[index]) {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
    
    // Remove cart item
    function removeCartItem(index) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
    
    // Update cart count
    function updateCartCount() {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      
      // Update cart count in header if element exists
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = cartCount.toString();
        
        if (cartCount > 0) {
          cartCountElement.classList.remove('hidden');
        } else {
          cartCountElement.classList.add('hidden');
        }
      }
    }
    
    // Initialize cart
    renderCart();
    updateCartCount();
  });
})();<\/script>`], ["<!-- Cart Sidebar -->", '<div id="cart-sidebar" class="fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out z-50"> <div class="flex flex-col h-full"> <!-- Cart Header --> <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"> <h2 class="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2> <button id="close-cart" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <!-- Cart Items --> <div id="cart-items" class="flex-grow overflow-y-auto p-4"> <!-- Cart items will be dynamically inserted here --> <div class="text-center text-gray-500 dark:text-gray-400 py-8" id="empty-cart-message">\nYour cart is empty\n</div> </div> <!-- Cart Summary --> <div class="border-t border-gray-200 dark:border-gray-700 p-4"> <div class="space-y-2 mb-4"> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Subtotal</span> <span id="cart-subtotal" class="font-medium text-gray-900 dark:text-white">$0.00</span> </div> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Tax</span> <span id="cart-tax" class="font-medium text-gray-900 dark:text-white">$0.00</span> </div> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Shipping</span> <span id="cart-shipping" class="font-medium text-gray-900 dark:text-white">$0.00</span> </div> <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700"> <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span> <span id="cart-total" class="text-lg font-bold text-gray-900 dark:text-white">$0.00</span> </div> </div> <a href="/checkout" id="checkout-button" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-semibold transition text-center opacity-50 cursor-not-allowed" aria-disabled="true">\nProceed to Checkout\n</a> </div> </div> </div> <!-- Cart Overlay --> <div id="cart-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div> <script>(function(){', `
  // Cart functionality
  document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    
    // Store data for calculations
    const storeData = {
      freeship: storeFreeship,
      statetax: storeStateTax,
      localtax: storeLocalTax,
      taxshipping: storeTaxShipping,
      shiprate: storeShipRate
    };
    
    // Open cart function
    function openCart() {
      if (cartSidebar) {
        cartSidebar.classList.remove('translate-x-full');
      }
      if (cartOverlay) {
        cartOverlay.classList.remove('hidden');
      }
      document.body.classList.add('overflow-hidden');
    }
    
    // Make openCart available globally
    window.openCart = openCart;
    
    // Close cart function
    function closeCart() {
      if (cartSidebar) {
        cartSidebar.classList.add('translate-x-full');
      }
      if (cartOverlay) {
        cartOverlay.classList.add('hidden');
      }
      document.body.classList.remove('overflow-hidden');
    }
    
    // Event listeners
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCart);
    }
    
    // Listen for cart toggle events
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest('.cart-toggle')) {
        openCart();
      }
    });
    
    // Render cart
    function renderCart() {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      // Show/hide empty cart message
      if (!cartItemsContainer || !emptyCartMessage || !checkoutButton) return;
      
      if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        checkoutButton.setAttribute('aria-disabled', 'true');
        checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
        cartItemsContainer.innerHTML = '';
        updateCartTotals(0, 0, 0, 0);
        return;
      }
      
      emptyCartMessage.classList.add('hidden');
      checkoutButton.setAttribute('aria-disabled', 'false');
      checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
      
      // Clear cart items container
      cartItemsContainer.innerHTML = '';
      
      // Calculate subtotal
      let subtotal = 0;
      
      // Render each cart item
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-start py-4 border-b border-gray-200 dark:border-gray-700 last:border-0';
        itemElement.innerHTML = \\\`
          <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <img src="\\\${item.image}" alt="\\\${item.name}" class="h-full w-full object-cover object-center">
          </div>
          <div class="ml-4 flex flex-1 flex-col">
            <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
              <h3>
                <a href="/product_\\\${item.id}">\\\${item.name}</a>
              </h3>
              <p class="ml-4">$\\\${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="flex items-center mt-2">
              <button class="decrement-item text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-index="\\\${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <span class="mx-2 text-gray-700 dark:text-gray-300">\\\${item.quantity}</span>
              <button class="increment-item text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-index="\\\${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="remove-item ml-auto text-red-500 hover:text-red-700" data-index="\\\${index}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        \\\`;
        
        cartItemsContainer.appendChild(itemElement);
      });
      
      // Calculate tax and shipping
      const tax = calculateTax(subtotal);
      const shipping = calculateShipping(subtotal);
      const total = subtotal + tax + shipping;
      
      // Update cart totals
      updateCartTotals(subtotal, tax, shipping, total);
      
      // Add event listeners to cart item buttons
      addCartItemEventListeners();
    }
    
    // Calculate tax
    function calculateTax(subtotal) {
      const taxRate = (parseFloat(storeData.statetax.toString()) + parseFloat(storeData.localtax.toString())) / 100;
      let taxableAmount = subtotal;
      
      // If shipping is taxable, add it to the taxable amount
      if (storeData.taxshipping) {
        const shipping = calculateShipping(subtotal);
        taxableAmount += shipping;
      }
      
      return taxableAmount * taxRate;
    }
    
    // Calculate shipping
    function calculateShipping(subtotal) {
      // Free shipping if enabled and subtotal is greater than 0
      if (storeData.freeship && subtotal > 0) {
        return 0;
      }
      
      // Return shipping rate if subtotal is greater than 0
      return subtotal > 0 ? parseFloat(storeData.shiprate.toString()) : 0;
    }
    
    // Update cart totals
    function updateCartTotals(subtotal, tax, shipping, total) {
      if (cartSubtotal) cartSubtotal.textContent = \\\`$\\\${subtotal.toFixed(2)}\\\`;
      if (cartTax) cartTax.textContent = \\\`$\\\${tax.toFixed(2)}\\\`;
      if (cartShipping) cartShipping.textContent = \\\`$\\\${shipping.toFixed(2)}\\\`;
      if (cartTotal) cartTotal.textContent = \\\`$\\\${total.toFixed(2)}\\\`;
    }
    
    // Add event listeners to cart item buttons
    function addCartItemEventListeners() {
      // Increment item quantity
      document.querySelectorAll('.increment-item').forEach(button => {
        button.addEventListener('click', () => {
          const indexAttr = button.getAttribute('data-index');
          if (indexAttr) {
            const index = parseInt(indexAttr);
            incrementCartItem(index);
          }
        });
      });
      
      // Decrement item quantity
      document.querySelectorAll('.decrement-item').forEach(button => {
        button.addEventListener('click', () => {
          const indexAttr = button.getAttribute('data-index');
          if (indexAttr) {
            const index = parseInt(indexAttr);
            decrementCartItem(index);
          }
        });
      });
      
      // Remove item
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
          const indexAttr = button.getAttribute('data-index');
          if (indexAttr) {
            const index = parseInt(indexAttr);
            removeCartItem(index);
          }
        });
      });
    }
    
    // Increment cart item quantity
    function incrementCartItem(index) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart[index]) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
    
    // Decrement cart item quantity
    function decrementCartItem(index) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart[index]) {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
    
    // Remove cart item
    function removeCartItem(index) {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      
      if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    }
    
    // Update cart count
    function updateCartCount() {
      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];
      const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
      
      // Update cart count in header if element exists
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = cartCount.toString();
        
        if (cartCount > 0) {
          cartCountElement.classList.remove('hidden');
        } else {
          cartCountElement.classList.add('hidden');
        }
      }
    }
    
    // Initialize cart
    renderCart();
    updateCartCount();
  });
})();<\/script>`])), maybeRenderHead(), defineScriptVars({ storeFreeship: store.freeship, storeStateTax: store.statetax, storeLocalTax: store.localtax, storeTaxShipping: store.taxshipping, storeShipRate: store.shiprate }));
}, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/components/CartComponent.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const storeInfo = await storeData;
  await categoriesData;
  await productsData;
  await blogPostsData;
  const store = {
    storename: storeInfo.store.storename,
    description: storeInfo.store.description,
    storenumber: storeInfo.store.storenumber,
    coverimage: storeInfo.store.coverimage,
    logoimage: storeInfo.store.logoimage,
    city: storeInfo.store.city,
    state: storeInfo.store.state,
    zipcode: storeInfo.store.zipcode,
    contactemail: storeInfo.store.contactemail,
    phonenumber: storeInfo.store.phonenumber,
    streetaddress: storeInfo.store.streetaddress,
    facebook: storeInfo.store.facebook,
    instagram: storeInfo.store.instagram,
    twitter: storeInfo.store.twitter,
    youtube: storeInfo.store.youtube,
    analytics: storeInfo.store.analytics,
    freeship: storeInfo.store.freeship,
    statetax: storeInfo.store.statetax,
    localtax: storeInfo.store.localtax,
    taxshipping: storeInfo.store.taxshipping,
    shiprate: storeInfo.store.shiprate
  };
  const nowYear = (/* @__PURE__ */ new Date()).getFullYear();
  if (store.freeship) {
    store.freeship = "Free Shipping";
  } else {
    store.freeship = "";
  }
  const { title = store.storename || "GSFirsite" } = Astro2.props;
  const navItems = [
    {
      label: "Firearms",
      href: "/firearms",
      dropdown: [
        { label: "Handguns", href: "/firearms/handguns" },
        { label: "Rifles", href: "/firearms/rifles" },
        { label: "Shotguns", href: "/firearms/shotguns" }
      ]
    },
    {
      label: "Accessories",
      href: "/accessories",
      dropdown: [
        { label: "Magazines", href: "/accessories/magazines" },
        { label: "Mounts", href: "/accessories/mounts" },
        { label: "Sights", href: "/accessories/sights" }
      ]
    },
    {
      label: "Gear",
      href: "/gear",
      dropdown: [
        { label: "Bags", href: "/gear/bags" },
        { label: "Belts", href: "/gear/belts" },
        { label: "Apparel", href: "/gear/apparel" }
      ]
    },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" }
  ];
  return renderTemplate`<html lang="en" class="h-full scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><meta name="description"${addAttribute(store.description, "content")}>${store.analytics && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(store.analytics)}` })}`}${renderHead()}</head> <body class="min-h-full flex flex-col bg-white text-gray-900"> <!-- Top utility bar --> <div class="bg-[#1f1f1f] text-white text-sm py-1"> <div class="max-w-7xl mx-auto px-4 mb-2 sm:px-6 lg:px-8 flex justify-between items-center"> <div class="hidden md:flex gap-4"> <span class="font-semibold text-gray-400">${store.storename} ${store.city}, ${store.state}</span> ${storeInfo.store.phonenumber && renderTemplate`<span class="text-gray-400">Phone | ${store.phonenumber}</span>`} ${storeInfo.store.contactemail && renderTemplate`<span class="text-gray-400">Email | ${store.contactemail}</span>`} </div> <div> <span>${store.freeship}</span> </div> <div class="flex gap-4"> <a href="/account" class="hover:text-[#d5ad6d]">My Account</a> <a href="/support" class="hover:text-[#d5ad6d]">Support</a> </div> </div> </div> <!-- Main header --> <header class="bg-[#141414] text-white sticky top-0 z-50 shadow-md"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between items-center h-16"> <!-- Logo --> <div class="flex-shrink-0"> <a href="/" class="text-2xl font-bold text-white"> ${store.logoimage ? renderTemplate`<img${addAttribute(store.logoimage, "src")} alt="Store Logo" class="h-16 mb-4">` : store.storename} </a> </div> <!-- Desktop Navigation --> <nav class="hidden md:flex space-x-6"> ${navItems.map((item) => renderTemplate`<div class="relative group"> <a${addAttribute(item.href, "href")} class="py-2 inline-flex items-center text-gray-300 hover:text-white"> ${item.label} ${item.dropdown && renderTemplate`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg>`} </a> ${item.dropdown && renderTemplate`<div class="absolute left-0 mt-2 w-48 bg-[#1f1f1f] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> ${item.dropdown.map((subItem) => renderTemplate`<a${addAttribute(subItem.href, "href")} class="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white"> ${subItem.label} </a>`)} </div>`} </div>`)} </nav> <!-- Search, Cart, Account Icons --> <div class="hidden md:flex items-center space-x-4"> <button class="text-gray-300 hover:text-white"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </button> <!-- Cart Component --> ${renderComponent($$result, "CartComponent", $$CartComponent, {})} </div> <!-- Mobile menu button --> <button id="mobile-menu-button" class="md:hidden inline-flex items-center justify-center p-2 text-gray-400 hover:text-white" aria-label="Main menu"> <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"> <path class="menu-open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> <path class="menu-close hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <!-- Mobile Navigation --> <div id="mobile-menu" class="hidden md:hidden pb-3"> <div class="space-y-1"> ${navItems.map((item) => renderTemplate`<div> <a${addAttribute(item.href, "href")} class="block py-2 text-gray-300 hover:text-white"> ${item.label} </a> ${item.dropdown && renderTemplate`<div class="ml-4 border-l border-gray-700 pl-4 space-y-1"> ${item.dropdown.map((subItem) => renderTemplate`<a${addAttribute(subItem.href, "href")} class="block py-2 text-sm text-gray-400 hover:text-white"> ${subItem.label} </a>`)} </div>`} </div>`)} <div class="pt-4 flex items-center justify-around border-t border-gray-700 mt-4"> <a href="/search" class="text-gray-300 hover:text-white"> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </a> <!-- Mobile Cart Component --> <div class="text-gray-300 hover:text-white"> ${renderComponent($$result, "CartComponent", $$CartComponent, {})} </div> </div> </div> </div> </div> </header> <!-- Main content --> <div class="flex-grow"> ${renderSlot($$result, $$slots["default"])} </div> <!-- Footer --> <footer class="bg-[#1f1f1f] text-gray-400"> <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> <!-- Store Info --> <div class="space-y-2"> <h3 class="text-white text-lg font-semibold mb-4">${store.storename}</h3> <p class="text-sm">${store.streetaddress}</p> <p class="text-sm">${store.city}, ${store.state} ${store.zipcode}</p> ${store.contactemail && renderTemplate`<p class="text-sm">${store.contactemail}</p>`} ${store.phonenumber && renderTemplate`<p class="text-sm">${store.phonenumber}</p>`} </div> <!-- Shop Links --> <div> <h3 class="text-white text-lg font-semibold mb-4">Shop</h3> <ul class="space-y-2"> <li><a href="/firearms" class="hover:text-red-600">Firearms</a></li> <li><a href="/accessories" class="hover:text-red-600">Accessories</a></li> <li><a href="/gear" class="hover:text-red-600">Gear</a></li> <li><a href="/apparel" class="hover:text-red-600">Apparel</a></li> </ul> </div> <!-- Support Links --> <div> <h3 class="text-white text-lg font-semibold mb-4">Support</h3> <ul class="space-y-2"> <li><a href="/contact" class="hover:text-red-600">Contact Us</a></li> <li><a href="/privacy" class="hover:text-red-600">Privacy Policy</a></li> <li><a href="/terms" class="hover:text-red-600">Terms of Service</a></li> <li><a href="/shipping" class="hover:text-red-600">Shipping</a></li> </ul> </div> <!-- Newsletter Signup --> <div> <h3 class="text-white text-lg font-semibold mb-4">Get Exclusive Offers</h3> <form id="newsletter-form" class="space-y-2"> <div class="flex"> <input type="email" name="email" placeholder="Enter your email" class="bg-gray-800 text-white px-3 py-2 flex-grow rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-600" required> <button type="submit" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-md font-medium transition">
Sign Up
</button> </div> <input type="hidden" name="storenumber"${addAttribute(store.storenumber, "value")}> <div class="hidden"> <label for="honeypot">Leave this empty</label> <input type="text" name="address" id="honeypot"> </div> </form> <div id="form-message" class="mt-2 text-sm hidden"></div> <!-- Social Links --> <div class="flex space-x-4 mt-6"> ${store.facebook && renderTemplate`<a${addAttribute(store.facebook, "href")} class="text-gray-400 hover:text-red-600"> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path> </svg> </a>`} ${store.instagram && renderTemplate`<a${addAttribute(store.instagram, "href")} class="text-gray-400 hover:text-red-600"> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path> </svg> </a>`} ${store.twitter && renderTemplate`<a${addAttribute(store.twitter, "href")} class="text-gray-400 hover:text-red-600"> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path> </svg> </a>`} ${store.youtube && renderTemplate`<a${addAttribute(store.youtube, "href")} class="text-gray-400 hover:text-red-600"> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clip-rule="evenodd"></path> </svg> </a>`} </div> </div> </div> <div class="pt-8 mt-8 border-t border-gray-700 text-sm text-center"> <p>&copy; ${nowYear} ${store.storename}. All rights reserved.</p> </div> </div> </footer> ${renderScript($$result, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/layouts/Layout.astro", void 0);

function optimizeImageUrl(url) {
  if (!url) {
    return "https://res.cloudinary.com/di0r3kmxh/image/upload/f_auto,q_auto/v1724876754/placeholder.jpg";
  }
  if (url.includes("cloudinary.com")) {
    if (!url.includes("f_auto") && !url.includes("q_auto")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
      }
    }
    return url;
  }
  return url;
}

export { $$Layout as $, blogPostsData as b, categoriesData as c, optimizeImageUrl as o, productsData as p, storeData as s };

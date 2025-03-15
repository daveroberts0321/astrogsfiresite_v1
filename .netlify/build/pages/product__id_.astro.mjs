/* empty css                                        */
import { e as createComponent, f as createAstro, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from '../chunks/astro/server_Yi5bUcOU.mjs';
import 'kleur/colors';
import { s as storeData, o as optimizeImageUrl, $ as $$Layout } from '../chunks/imageUtils_Beob11_A.mjs';
import { c as cacheData, C as CACHE_DURATION, A as API_BASE_URL } from '../chunks/redis_BM_TMpFB.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Productid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Productid;
  const { id } = Astro2.params;
  const productId = id || "0";
  const storeInfo = await storeData;
  const store = {
    storename: storeInfo.store.storename,
    description: storeInfo.store.description,
    storenumber: storeInfo.store.storenumber,
    coverimage: storeInfo.store.coverphoto,
    logoimage: storeInfo.store.logoimage,
    freeship: storeInfo.store.freeship,
    statetax: storeInfo.store.statetax,
    localtax: storeInfo.store.localtax,
    taxshipping: storeInfo.store.taxshipping,
    shiprate: storeInfo.store.shiprate
    // ... other store properties
  };
  const fetchProduct = async (productId2) => {
    try {
      let baseUrl = API_BASE_URL;
      const url = `${baseUrl}/apiproductbyid_${productId2}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch product");
      return await response.json();
    } catch (error) {
      console.error("Error fetching product:", error);
      return { product: null };
    }
  };
  const fetchProductAddOns = async (productId2) => {
    try {
      let baseUrl = API_BASE_URL;
      const url = `${baseUrl}/api/productadd-ons_${productId2}`;
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Add-ons response not OK:", response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing add-ons JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Error fetching product add-ons:", error);
      return null;
    }
  };
  const productData = await cacheData(
    `product:${productId}`,
    () => fetchProduct(productId),
    CACHE_DURATION
  );
  const addOnsData = await cacheData(
    `product-addons:${productId}`,
    () => fetchProductAddOns(productId),
    CACHE_DURATION
  );
  const product = productData.product || {};
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return price.toFixed(2);
    }
    if (typeof price === "string") {
      const parsedPrice = parseFloat(price);
      return isNaN(parsedPrice) ? "0.00" : parsedPrice.toFixed(2);
    }
    return "0.00";
  };
  const inStock = product.productstock > 0;
  const productImages = [
    product.productimage,
    product.img2,
    product.img3,
    product.img4,
    product.img5,
    product.img6,
    product.img7
  ].filter(Boolean).map((img) => optimizeImageUrl(img));
  const pageTitle = product.productname ? `${product.productname} - ${store.storename}` : store.storename;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-8 bg-white text-gray-900"> <!-- Breadcrumb --> <nav class="text-sm text-gray-600 mb-6"> <a href="/" class="hover:text-red-600 transition-colors">Home</a> &gt;
${product.categoryid && renderTemplate`<a${addAttribute(`/category_${product.categoryid}`, "href")} class="hover:text-red-600 transition-colors"> ${product.categoryname || "Category"} </a>`} &gt;
<span class="text-black">${product.productname}</span> </nav> <!-- Product Details --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12"> <!-- Image Gallery --> <div class="space-y-4"> <img${addAttribute(productImages[0], "src")} alt="Main {product.productname} Image" class="w-full rounded-lg shadow-lg" id="main-product-image"> ${productImages.length > 1 && renderTemplate`<div class="grid grid-cols-4 gap-2"> ${productImages.map((image, index) => renderTemplate`<img${addAttribute(image, "src")}${addAttribute(`${product.productname} ${index + 1}`, "alt")} class="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer product-thumbnail"${addAttribute(image, "data-image-url")}>`)} </div>`} </div> <!-- Product Details --> <div class="space-y-6"> <h1 class="text-3xl font-bold text-black">${product.productname}</h1> <div class="flex items-center gap-2"> ${product.productretailprice && parseFloat(product.productretailprice) > parseFloat(product.productprice) && renderTemplate`<span class="text-2xl font-semibold text-gray-500 line-through">$${formatPrice(product.productretailprice)}</span>`} <div class="text-2xl font-semibold text-red-600" id="product-price">$${formatPrice(product.productprice)}</div> </div> <div class="text-sm text-gray-600">Inventory: ${product.productstock}</div> <p class="text-gray-700">${product.productshortdesc}</p> ${product.freeship && renderTemplate`<div class="p-3 border border-black rounded-lg"> <h2 class="text-lg font-bold">Free Shipping!</h2> </div>`} ${product.isffl && renderTemplate`<div class="p-3 border border-red-600 rounded-lg"> <h2 class="text-s font-semibold">FFL Item, must ship to your local dealer</h2> </div>`} <!-- Product Add-Ons Section --> ${addOnsData && addOnsData.AddOns && addOnsData.AddOns.length > 0 && renderTemplate`<div class="mt-6 space-y-4" id="product-add-ons"> <h2 class="text-m font-semibold text-black mb-4">Customize Your ${product.productname}</h2> <div id="validation-error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 hidden" role="alert"> <span class="block sm:inline" id="validation-error-text"></span> </div> ${addOnsData.AddOns.map((addon) => renderTemplate`<div class="bg-gray-50 p-4 rounded-lg border border-gray-200"> <div class="flex items-center gap-2 mb-2"> <h3 class="text-lg font-medium text-black">${addon.addonname}</h3> ${addon.hasoptions && addOnsData.OptionNames.find((on) => on.ID === addon.optionnameid)?.required && renderTemplate`<span class="text-red-600 text-sm font-medium">*Required</span>`} </div> ${addon.desc && renderTemplate`<p class="text-sm text-gray-600 mb-3">${addon.desc}</p>`} ${addon.hasoptions ? renderTemplate`<select class="w-full p-2 border border-gray-300 rounded-lg bg-white addon-option-select"${addAttribute(`addon-${addon.ID}`, "name")}${addAttribute(addon.ID, "data-addon-id")}${addAttribute(addon.addonname, "data-addon-name")}${addAttribute(addOnsData.OptionNames.find((on) => on.ID === addon.optionnameid)?.required || "false", "data-required")}> <option value="">None</option> ${addOnsData.Options.filter((option) => option.optionnameid === addon.optionnameid).map((option) => renderTemplate`<option${addAttribute(option.ID, "value")}${addAttribute(option.optionname, "data-option-name")}${addAttribute(option.optionprice, "data-option-price")}${addAttribute(option.optionimg, "data-option-img")}> ${option.optionname} ${parseFloat(option.optionprice) > 0 ? `(+$${parseFloat(option.optionprice).toFixed(2)})` : ""} </option>`)} </select>` : renderTemplate`<label class="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"> <input type="checkbox" class="form-checkbox simple-addon-checkbox"${addAttribute(addon.ID, "data-addon-id")}${addAttribute(addon.addonname, "data-addon-name")}${addAttribute(addon.price, "data-addon-price")}> <div class="flex-1"> <div class="flex items-center justify-between"> <span class="font-medium">${addon.addonname}</span> <div class="flex items-center gap-4"> ${parseFloat(addon.price) > 0 && renderTemplate`<span class="text-red-600">+$${parseFloat(addon.price).toFixed(2)}</span>`} </div> </div> </div> </label>`} <div class="option-image mt-2 hidden"${addAttribute(addon.ID, "data-addon-id")}></div> </div>`)} <div class="bg-gray-100 p-4 rounded-lg mt-4"> <h3 class="text-xl font-semibold">Total Price: <span id="total-price">$${formatPrice(product.productprice)}</span></h3> </div> </div>`} <!-- Add to Cart Section --> <div class="flex flex-col space-y-4"> ${inStock ? renderTemplate`<div class="flex flex-wrap items-center gap-4"> <button id="add-to-cart-btn" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"${addAttribute(product.ID, "data-product-id")}${addAttribute(product.productname, "data-product-name")}${addAttribute(product.productprice, "data-product-price")}${addAttribute(product.productimage, "data-product-image")}>
Add to Cart
</button> <button id="add-to-cart-with-options-btn" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors hidden">
Add to Cart with Options
</button> <a href="/" class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
Continue Shopping
</a> </div>` : renderTemplate`<button disabled class="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed">
Out of Stock
</button>`} </div> <!-- Cart Status Section --> <div id="cart-status" class="bg-gray-100 p-4 rounded-lg border border-gray-300 hidden"> <h5 class="text-lg font-semibold text-black">In Cart: <span id="cart-quantity">0</span></h5> <div id="cart-options" class="text-sm text-gray-600 mt-2 hidden">
Selected options:
<div id="cart-options-list"></div> </div> <button id="remove-from-cart-btn" class="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
Remove
</button> <a href="/checkout" class="mx-4 mt-3 inline-block text-black hover:text-red-600 transition-colors">
Go To Cart <i class="fas fa-shopping-cart text-2xl"></i> </a> </div> </div> </div> <hr class="mx-auto mt-4"> <!-- Product Description --> <div class="mt-6"> <h2 class="text-xl font-semibold text-black mb-2">Product Description</h2> <div class="text-gray-700 prose prose-sm max-w-none"> ${product.productdesc ? renderTemplate`<div>${unescapeHTML(product.productdesc)}</div>` : renderTemplate`<p>${product.productshortdesc}</p>`} </div> </div> <!-- Product Specs --> ${(product.weight || product.length || product.width) && renderTemplate`<div class="bg-gray-100 p-4 rounded-lg border border-gray-300 mt-6"> <h2 class="text-lg font-semibold mb-2 text-black">Product Specs</h2> <p class="text-sm text-gray-700"> ${product.weight && `Weight: ${product.weight}`} ${product.length && `, Length: ${product.length}`} ${product.width && `, Width: ${product.width}`} </p> </div>`} <!-- Additional Images --> ${(product.img4 || product.img5 || product.img6 || product.img7) && renderTemplate`<div class="mt-4"> <hr class="border-t-4 border-red-700 my-4"> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> ${product.img4 && renderTemplate`<img${addAttribute(optimizeImageUrl(product.img4), "src")} alt="Additional view 1" class="w-full">`} ${product.img5 && renderTemplate`<img${addAttribute(optimizeImageUrl(product.img5), "src")} alt="Additional view 2" class="w-full">`} ${product.img6 && renderTemplate`<img${addAttribute(optimizeImageUrl(product.img6), "src")} alt="Additional view 3" class="w-full">`} ${product.img7 && renderTemplate`<img${addAttribute(optimizeImageUrl(product.img7), "src")} alt="Additional view 4" class="w-full">`} </div> </div>`} <!-- Video Section --> ${product.video && renderTemplate`<div class="mt-12 bg-gray-800 p-6 rounded-lg"> <h2 class="text-2xl font-semibold mb-4 text-gray-200">Product Video</h2> <div class="relative pt-[56.25%]"> <video id="videoPlayer" class="absolute top-0 left-0 w-full h-full rounded-lg" controls preload="metadata"${addAttribute(product.productimage, "poster")}> <source${addAttribute(product.video, "src")} type="video/mp4"> <track kind="captions" src="" label="English" srclang="en" default>
Your browser does not support the video tag.
</video> </div> </div>`} <!-- Warranty Section --> <div class="mt-4"> <h5 class="text-center font-semibold">--Warranty--</h5> <p class="text-center text-xs">
Tennessee Arms Products are warranted to be free from defects in materials or workmanship. 
        Tennessee Arms will, at its sole option, repair or replace any components 
        that fail in normal use. Such repairs or replacement will be made at no charge to the customer 
        for parts or labor, provided the customer shall be responsible for any transportation and/or
         shipping cost. This warranty does not apply to: (i) cosmetic damage, such as scratches, 
         nicks and dents; (ii) consumable parts; (iii) damage caused by accident, abuse, misuse,
          water, flood, fire, or other acts of nature or external causes; (iv) damage caused by
           service or repair performed by anyone who is not an authorized service provider of 
           Tennessee Arms; or (v) damage to a product that has been modified or altered. In 
           addition, Tennessee Arms reserves the right to refuse warranty claims against products or 
           services that are obtained and/or used in contravention of the laws of any country.By purchasing any 
           Tennessee Arms Product or Service you agree to the terms of this warranty.
</p> </div> </main> ` })} ${renderScript($$result, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/product_[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/product_[id].astro", void 0);

const $$file = "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/product_[id].astro";
const $$url = "/product_[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Productid,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

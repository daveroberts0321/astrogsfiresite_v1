/* empty css                                        */
import { e as createComponent, f as createAstro, i as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Yi5bUcOU.mjs';
import 'kleur/colors';
import { s as storeData, o as optimizeImageUrl, $ as $$Layout } from '../chunks/imageUtils_Beob11_A.mjs';
import { c as cacheData, C as CACHE_DURATION, A as API_BASE_URL } from '../chunks/redis_BM_TMpFB.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Categoryid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Categoryid;
  const { id } = Astro2.params;
  const categoryId = id || "0";
  const url = new URL(Astro2.request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const itemsPerPage = parseInt(url.searchParams.get("itemsPerPage") || "25");
  const storeInfo = await storeData;
  const store = {
    storename: storeInfo.store.storename,
    description: storeInfo.store.description,
    storenumber: storeInfo.store.storenumber,
    coverimage: storeInfo.store.coverphoto,
    logoimage: storeInfo.store.logoimage
    // ... other store properties
  };
  const baseUrl = API_BASE_URL;
  const fetchCategory = async (categoryId2) => {
    try {
      const response = await fetch(`${baseUrl}/apicategorybyid_${categoryId2}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      return await response.json();
    } catch (error) {
      console.error("Error fetching category:", error);
      return { category: null };
    }
  };
  const fetchProducts = async (categoryId2, page2 = 1, itemsPerPage2 = 25) => {
    try {
      const response = await fetch(`${baseUrl}/apiproductsbycategory_${categoryId2}?page=${page2}&itemsPerPage=${itemsPerPage2}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [], total: 0 };
    }
  };
  const fetchSubCategories = async (categoryId2) => {
    try {
      const response = await fetch(`${baseUrl}/apisubcategoriesbycategory_${categoryId2}`);
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      return await response.json();
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return { subcategories: [] };
    }
  };
  const cacheKey = `category:${categoryId}:page:${page}:items:${itemsPerPage}`;
  const cacheDuration = CACHE_DURATION;
  const [categoryData, productsData, subcategoriesData] = await Promise.all([
    cacheData(`${cacheKey}:info`, () => fetchCategory(categoryId), cacheDuration),
    cacheData(`${cacheKey}:products`, () => fetchProducts(categoryId, page, itemsPerPage), cacheDuration),
    cacheData(`${cacheKey}:subcategories`, () => fetchSubCategories(categoryId), cacheDuration)
  ]);
  const category = categoryData?.category || {};
  const products = productsData?.products || [];
  const subcategories = subcategoriesData?.subcategories || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  category.image = optimizeImageUrl(category.categoryimage || category.image && category.image.url);
  products.forEach((product) => {
    product.image = optimizeImageUrl(product.productimage || product.image && product.image.url);
  });
  const pageTitle = category.categoryname ? `${category.categoryname} - ${store.storename}` : store.storename;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-7xl mx-auto px-4 py-8"> <!-- Category Header --> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${category.categoryname}</h1> ${category.categorydesc && renderTemplate`<p class="text-gray-600 dark:text-gray-300">${category.categorydesc}</p>`} </div> <!-- Subcategories (if any) --> ${subcategories.length > 0 && renderTemplate`<div class="mb-8"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subcategories</h2> <div class="grid grid-cols-2 md:grid-cols-4 gap-4"> ${subcategories.map((subcat) => renderTemplate`<a${addAttribute(`/category_${subcat.ID}`, "href")} class="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition text-center"> <span class="text-gray-900 dark:text-white font-medium">${subcat.categoryname}</span> </a>`)} </div> </div>`} <!-- Products Grid --> ${products.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"> ${products.map((product) => renderTemplate`<a${addAttribute(`/product_${product.ID}`, "href")} class="group"> <div class="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition hover:shadow-lg relative h-full"> <div class="overflow-hidden"> <img${addAttribute(product.image, "src")}${addAttribute(product.productname, "alt")} class="w-full h-72 object-cover transition duration-300 group-hover:scale-105">  ${product.productstock > 1 && renderTemplate`<div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
In Stock: ${product.productstock} </div>`} </div> <div class="p-4"> <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${product.productname}</h3> <div class="mt-2 flex items-center gap-2"> ${product.productretailprice && product.productretailprice > product.productprice && renderTemplate`<p class="text-red-400 line-through text-sm">
$${typeof product.productretailprice === "number" ? product.productretailprice.toFixed(2) : "0.00"} </p>`} <p class="text-red-600 font-bold">
$${typeof product.productprice === "number" ? product.productprice.toFixed(2) : "0.00"} </p> </div> <p class="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">${product.shortdescription || product.description}</p> </div>  <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 
                  flex items-center justify-center p-6 z-10 pointer-events-none"> <div class="text-white text-center max-w-xs mx-auto"> <h3 class="text-xl font-bold mb-2">${product.productname}</h3> <div class="flex items-center justify-center gap-2 mb-3"> ${product.productretailprice && product.productretailprice > product.productprice && renderTemplate`<p class="text-red-400 line-through text-sm">
$${typeof product.productretailprice === "number" ? product.productretailprice.toFixed(2) : "0.00"} </p>`} <p class="text-red-500 font-bold">
$${typeof product.productprice === "number" ? product.productprice.toFixed(2) : "0.00"} </p> </div> ${product.productstock > 1 && renderTemplate`<p class="text-green-400 mb-3">In Stock: ${product.productstock}</p>`} <p class="text-sm md:text-base leading-relaxed">${product.shortdescription || product.description}</p> </div> </div> </div> </a>`)} </div>` : renderTemplate`<div class="text-center py-12"> <p class="text-gray-600 dark:text-gray-300">No products found in this category.</p> </div>`} <!-- Pagination --> ${totalPages > 1 && renderTemplate`<div class="flex justify-center mt-8"> <nav class="flex items-center space-x-2"> ${page > 1 && renderTemplate`<a${addAttribute(`/category_${categoryId}?page=${page - 1}&itemsPerPage=${itemsPerPage}`, "href")} class="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
Previous
</a>`} <span class="px-4 py-2 border rounded-md bg-red-600 text-white">
Page ${page} of ${totalPages} </span> ${page < totalPages && renderTemplate`<a${addAttribute(`/category_${categoryId}?page=${page + 1}&itemsPerPage=${itemsPerPage}`, "href")} class="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
Next
</a>`} </nav> </div>`} </main> ` })}`;
}, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/category_[id].astro", void 0);

const $$file = "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/category_[id].astro";
const $$url = "/category_[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categoryid,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

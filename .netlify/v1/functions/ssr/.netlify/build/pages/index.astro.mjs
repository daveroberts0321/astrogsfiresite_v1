/* empty css                                        */
import { e as createComponent, i as renderComponent, j as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_Yi5bUcOU.mjs';
import 'kleur/colors';
import { s as storeData, c as categoriesData, p as productsData, b as blogPostsData, o as optimizeImageUrl, $ as $$Layout } from '../chunks/imageUtils_Beob11_A.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const storeInfo = await storeData;
  const categoriesDataFetched = await categoriesData;
  const productsDataFetched = await productsData;
  const blogPostsDataFetched = await blogPostsData;
  const store = {
    storename: storeInfo.store.storename,
    description: storeInfo.store.description,
    storenumber: storeInfo.store.storenumber,
    coverimage: storeInfo.store.coverphoto,
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
  const categories = categoriesDataFetched.categories ? categoriesDataFetched.categories.map((cat) => {
    let imageUrl = cat.categoryimage;
    if (!imageUrl && cat.image && cat.image.url) {
      imageUrl = cat.image.url;
    }
    return {
      name: cat.categoryname,
      description: cat.categorydesc,
      image: imageUrl,
      link: `/category_${cat.ID}`
      // Updated to use underscore format
    };
  }) : [];
  const featuredProducts = productsDataFetched.products ? productsDataFetched.products.map((prod) => {
    let imageUrl = prod.productimage;
    if (!imageUrl && prod.image && prod.image.url) {
      imageUrl = prod.image.url;
    }
    let stock = 0;
    if (prod.productstock !== void 0) {
      if (typeof prod.productstock === "string") {
        stock = parseInt(prod.productstock, 10) || 0;
      } else if (typeof prod.productstock === "number") {
        stock = prod.productstock;
      }
    }
    const salePrice = prod.productprice || prod.price || 0;
    const retailPrice = prod.productretailprice || null;
    return {
      name: prod.productname,
      salePrice,
      retailPrice,
      image: imageUrl,
      link: `/product_${prod.ID}`,
      // Updated to use underscore format
      stock,
      description: prod.shortdescription || prod.description || ""
    };
  }) : [];
  const blogPosts = blogPostsDataFetched.posts ? blogPostsDataFetched.posts.map((post) => {
    let imageUrl = post.image || post.coverimage;
    if (!imageUrl && post.image && post.image.url) {
      imageUrl = post.image.url;
    }
    let excerpt = post.excerpt;
    if (!excerpt && post.content) {
      excerpt = post.content.substring(0, 150) + "...";
    }
    return {
      title: post.title,
      date: new Date(post.CreatedAt).toLocaleDateString(),
      excerpt,
      image: imageUrl,
      link: `/blog_${post.ID}`
      // Updated to use underscore format
    };
  }) : [];
  store.coverimage = optimizeImageUrl(store.coverimage);
  store.logoimage = optimizeImageUrl(store.logoimage);
  categories.forEach((category) => category.image = optimizeImageUrl(category.image));
  featuredProducts.forEach((product) => product.image = optimizeImageUrl(product.image));
  blogPosts.forEach((post) => post.image = optimizeImageUrl(post.image));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": store.storename }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main> <!-- 
  Modern Banner Section with Tailwind CSS
  - Uses proper responsive classes
  - Adds smooth transitions and shadows
  - Improves image loading with aspect ratio
  - Maintains simple structure for readability
--> <section class="relative w-full"> <!-- Container with proper aspect ratio that maintains height across screen sizes --> <div class="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] w-full overflow-hidden"> <!-- Base image with modern loading attributes --> <img${addAttribute(store.coverimage ? store.coverimage : "https://res.cloudinary.com/di0r3kmxh/image/upload/f_auto,q_auto/v1724876754/mIhSxrxokr.jpg", "src")} alt="Hero Banner" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="eager" fetchpriority="high"> <!-- Enhanced overlay with gradient and better opacity handling --> <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 backdrop-blur-[2px]"> <!-- Content container with improved spacing --> <div class="flex flex-col items-center justify-center h-full p-6 md:p-12 text-center"> <!-- Logo with drop shadow - hidden on mobile, visible on md screens and up --> <img${addAttribute(store.logoimage, "src")} alt="Store Logo" class="hidden md:block h-24 md:h-32 lg:h-40 mb-4 md:mb-6 filter drop-shadow-lg transition-all duration-500"> <!-- Heading with text shadow and responsive font sizes --> <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white drop-shadow-md"> ${store.storename} </h1> <!-- Description with improved readability --> <p class="text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 text-white/90 drop-shadow"> ${store.description} </p> <!-- Button container - hidden on mobile, visible on md screens and up --> <div class="hidden md:flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md"> <!-- Shop Now button with hover effects --> <a href="/shop" class="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md font-semibold 
                   transition-all duration-300 shadow-lg hover:shadow-red-600/30 w-full text-center">
Shop Now
</a> <!-- Learn More button with hover effects --> <a href="/about" class="bg-transparent text-white py-3 px-6 rounded-md font-semibold 
                   border border-white/70 hover:border-white hover:bg-white/10 
                   transition-all duration-300 w-full text-center">
Learn More
</a> </div> </div> </div> </div> </section> <!-- Categories Section --> <section class="py-16 px-4 bg-gray-50 dark:bg-gray-800"> <div class="max-w-7xl mx-auto"> <h2 class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Shop By Category</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> ${categories.map((category) => renderTemplate`<a${addAttribute(category.link, "href")} class="group"> <div class="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-700 relative h-full"> <div class="overflow-hidden"> <img${addAttribute(category.image, "src")}${addAttribute(category.name, "alt")} class="w-full h-64 object-cover transition duration-300 group-hover:scale-105"> </div> <div class="p-4 text-center"> <h3 class="text-xl font-bold text-gray-900 dark:text-white">${category.name}</h3> </div>  ${category.description && renderTemplate`<div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 
											flex items-center justify-center p-6 z-10 pointer-events-none"> <div class="text-white text-center max-w-xs mx-auto"> <h3 class="text-xl font-bold mb-3">${category.name}</h3> <p class="text-sm md:text-base leading-relaxed">${category.description}</p> </div> </div>`} </div> </a>`)} </div> </div> </section> <!-- Featured Products --> <section class="py-16 px-4"> <div class="max-w-7xl mx-auto"> <div class="flex justify-between items-center mb-12"> <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2> <a href="/shop" class="text-red-600 hover:text-red-800 font-semibold">View All</a> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> ${featuredProducts.map((product) => renderTemplate`<a${addAttribute(product.link, "href")} class="group"> <div class="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition hover:shadow-lg relative h-full"> <div class="overflow-hidden"> <img${addAttribute(product.image, "src")}${addAttribute(product.name, "alt")} class="w-full h-72 object-cover transition duration-300 group-hover:scale-105">  ${product.stock > 1 && renderTemplate`<div class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
In Stock: ${product.stock} </div>`} </div> <div class="p-4"> <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${product.name}</h3> <div class="mt-2 flex items-center gap-2"> ${product.retailPrice && product.retailPrice > product.salePrice && renderTemplate`<p class="text-red-400 line-through text-sm">
$${typeof product.retailPrice === "number" ? product.retailPrice.toFixed(2) : "0.00"} </p>`} <p class="text-red-600 font-bold">
$${typeof product.salePrice === "number" ? product.salePrice.toFixed(2) : "0.00"} </p> </div> <p class="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">${product.description}</p> </div>  <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 
										flex items-center justify-center p-6 z-10 pointer-events-none"> <div class="text-white text-center max-w-xs mx-auto"> <h3 class="text-xl font-bold mb-2">${product.name}</h3> <div class="flex items-center justify-center gap-2 mb-3"> ${product.retailPrice && product.retailPrice > product.salePrice && renderTemplate`<p class="text-red-400 line-through text-sm">
$${typeof product.retailPrice === "number" ? product.retailPrice.toFixed(2) : "0.00"} </p>`} <p class="text-red-500 font-bold">
$${typeof product.salePrice === "number" ? product.salePrice.toFixed(2) : "0.00"} </p> </div> ${product.stock > 1 && renderTemplate`<p class="text-green-400 mb-3">In Stock: ${product.stock}</p>`} <p class="text-sm md:text-base leading-relaxed">${product.description}</p> </div> </div> </div> </a>`)} </div> </div> </section> <!-- Banner/CTA Section --> <section class="relative py-16"> <div class="w-full h-80 bg-cover bg-center"${addAttribute(`background-image: url('${store.coverimage}')`, "style")}> <div class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center px-4 text-center"> <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Professional Grade Equipment</h2> <p class="text-lg md:text-xl text-white mb-8 max-w-3xl">
Equip your department with reliable gear that meets the highest safety standards
</p> <a href="/contact" class="bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-md font-semibold transition">
Contact Sales
</a> </div> </div> </section> <!-- Blog/News Section --> <section class="py-16 px-4 bg-gray-50 dark:bg-gray-800"> <div class="max-w-7xl mx-auto"> <div class="flex justify-between items-center mb-12"> <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Latest News & Guides</h2> <a href="/blog" class="text-red-600 hover:text-red-800 font-semibold">View All Posts</a> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> ${blogPosts.map((post) => renderTemplate`<a${addAttribute(post.link, "href")} class="group"> <div class="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition hover:shadow-lg h-full flex flex-col"> <div class="overflow-hidden"> <img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-48 object-cover transition duration-300 group-hover:scale-105"> </div> <div class="p-6 flex flex-col flex-grow"> <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${post.date}</p> <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">${post.title}</h3> <p class="text-gray-600 dark:text-gray-300 mb-4 flex-grow">${post.excerpt}</p> <span class="text-red-600 font-semibold group-hover:underline">Read More</span> </div> </div> </a>`)} </div> </div> </section> <!-- Newsletter Section --> <section class="py-16 px-4"> <div class="max-w-3xl mx-auto text-center"> <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Stay Updated</h2> <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
Subscribe to our newsletter for the latest product updates, promotions, and fire service news.
</p> <form class="flex flex-col sm:flex-row gap-2" id="newsletter-form"> <input type="email" name="email" placeholder="Enter your email" class="px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white flex-grow focus:outline-none focus:ring-2 focus:ring-red-600" required> <input type="hidden" name="storenumber"${addAttribute(store.storenumber, "value")}> <div class="hidden"> <label for="honeypot">Leave this empty</label> <input type="text" name="address" id="honeypot"> </div> <button type="submit" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition">
Subscribe
</button> </form> <div id="form-message" class="mt-2 text-sm hidden"></div> </div> </section> </main> ` })} ${renderScript($$result, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/index.astro", void 0);

const $$file = "C:/Users/dave/coding/Astro/gsfiresite_v1/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

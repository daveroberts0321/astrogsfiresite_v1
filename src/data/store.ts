// Store data for the application
// This file contains the store information used throughout the site

export const storeData = {
  storename: "Gunstore Firearms",
  description: "Your trusted source for firearms, accessories, and gear",
  contactemail: "info@gunstore.com",
  contactphone: "(555) 123-4567",
  address: "123 Main Street",
  city: "Anytown",
  state: "TX",
  zip: "12345",
  logo: "/images/logo.png",
  coverimage: "/images/store-cover.jpg",
  facebook: "https://facebook.com/gunstore",
  twitter: "https://twitter.com/gunstore",
  instagram: "https://instagram.com/gunstore",
  youtube: "https://youtube.com/gunstore",
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 7:00 PM",
    saturday: "10:00 AM - 5:00 PM",
    sunday: "Closed"
  },
  shipping: {
    freeship: 100, // Free shipping threshold
    shiprate: 10, // Base shipping rate
    addshipping: 15 // Additional shipping for special items
  },
  tax: {
    statetax: 6.25, // State tax percentage
    localtax: 2, // Local tax percentage
    taxshipping: false // Whether to apply tax to shipping
  }
}; 
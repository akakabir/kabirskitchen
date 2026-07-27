// Kabir's Kitchen catalog dataset.
// Images use curated Unsplash photo IDs by category.

export type Cuisine = "Indian" | "Chinese" | "Arabian" | "Continental";
export type Category =
  | "Starters"
  | "Main Course"
  | "Rice/Biryani"
  | "Breads"
  | "Beverages"
  | "Combos"
  | "Desserts";
export type Spice = "Mild" | "Medium" | "Spicy";

export interface OptionChoice { id: string; label: string; priceDelta: number; }
export interface OptionGroup {
  id: string;
  label: string;
  type: "single" | "multi";
  required?: boolean;
  choices: OptionChoice[];
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  veg: boolean;
  cuisine: Cuisine;
  category: Category;
  rating: number;
  description: string;
  image: string;
  spice?: Spice;
  isSellingHot?: boolean;
  popularity?: number;
  options?: OptionGroup[];
  kind: "dish" | "dessert";
  dessertType?: "Cakes" | "Pastries" | "Ice Cream" | "Indian Sweets" | "Brownies/Cookies" | "Middle-Eastern" | "Others";
  flavor?: string;
  eggless?: boolean;
}

// Curated Unsplash photo IDs — reliable direct CDN URLs.
const IMG = {
  curry: "1585937421612-70a008356fbe",
  butterChicken: "1603894584373-5ac82b2ae398",
  biryani: "1563379091339-03b21ab4a4f8",
  paneer: "1631452180519-c014fe946bc7",
  samosa: "1601050690597-df0568f70950",
  tikka: "1567188040759-fb8a883dc6d8",
  dosa: "1668236543090-82eba5ee5976",
  naan: "1626074353765-517a681e40be",
  thali: "1567337710282-00832b415979",
  dal: "1626200419199-391ae4be7a41",
  chowmein: "1585032226651-759b368d7246",
  friedRice: "1512058564366-18510be2db19",
  manchurian: "1585032226651-759b368d7246",
  dimsum: "1496116218417-1a781b1c416c",
  springRoll: "1548340748-6d2b7d7da280",
  hakka: "1552611052-33e04de081de",
  shawarma: "1633321702518-7feccafb94d5",
  mandi: "1590846406792-0adc7f938f1d",
  hummus: "1636195691-2caf75d3ecca",
  falafel: "1547592180-85f173990554",
  kebab: "1529193591184-b1d58069ecdd",
  pizza: "1513104890138-7c749659a591",
  burger: "1568901346375-23c9450c58cd",
  fries: "1573080496219-bb080dd4f877",
  wrap: "1600891964092-4316c288032e",
  lassi: "1626200925894-1e4b3f8b8b1e",
  juice: "1600271886742-f049cd451bba",
  coffee: "1509042239860-f550ce710b93",
  tea: "1544787219-7f47ccb76574",
  softdrink: "1622483767028-3f66f32aef97",
  water: "1550505095-81378a674395",
  cake: "1578985545062-69928b1d9587",
  cakeChoc: "1606313564200-e75d5e30476c",
  cakeRedVelvet: "1586788680434-30d324b2d46f",
  cakeVanilla: "1621303837174-89787a7d4729",
  brownie: "1606313564200-e75d5e30476c",
  icecream: "1497034825429-c343d7c6a68f",
  kulfi: "1615832494873-b0c52d519696",
  gulab: "1631206753348-db44968fd440",
  rasmalai: "1605197181-84702ba6a3d4",
  jalebi: "1589301760014-d929f3979dbc",
  laddoo: "1605197181-84702ba6a3d4",
  baklava: "1587314168485-3236d6710814",
  kunafa: "1579954115545-a95591f28bfc",
  cookie: "1499636136210-6f4ee915583e",
  pastry: "1587248720327-8eb72564be1e",
};

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&auto=format&q=75`;

// ---- Customization templates ----
const sizeOpt = (base = 0): OptionGroup => ({
  id: "size", label: "Size", type: "single", required: true,
  choices: [
    { id: "s", label: "Regular", priceDelta: 0 },
    { id: "m", label: "Medium", priceDelta: 30 + base },
    { id: "l", label: "Large", priceDelta: 60 + base },
  ],
});
const spiceOpt: OptionGroup = {
  id: "spice", label: "Spice level", type: "single", required: true,
  choices: [
    { id: "mild", label: "Mild", priceDelta: 0 },
    { id: "med", label: "Medium", priceDelta: 0 },
    { id: "spicy", label: "Spicy", priceDelta: 0 },
  ],
};
const addonDrink: OptionGroup = {
  id: "drink", label: "Pair with a drink", type: "multi",
  choices: [
    { id: "coke", label: "Coke (250ml)", priceDelta: 40 },
    { id: "lassi", label: "Sweet Lassi", priceDelta: 60 },
  ],
};
const pizzaOpts = (): OptionGroup[] => [
  { id: "size", label: "Size", type: "single", required: true, choices: [
    { id: "s", label: "Small (7\")", priceDelta: 0 },
    { id: "m", label: "Medium (10\")", priceDelta: 80 },
    { id: "l", label: "Large (13\")", priceDelta: 160 },
  ]},
  { id: "crust", label: "Crust", type: "single", required: true, choices: [
    { id: "hand", label: "Hand tossed", priceDelta: 0 },
    { id: "thin", label: "Thin crust", priceDelta: 0 },
    { id: "cheese", label: "Cheese burst", priceDelta: 70 },
  ]},
  { id: "extras", label: "Extras", type: "multi", choices: [
    { id: "cheese", label: "Extra cheese", priceDelta: 50 },
    { id: "olives", label: "Olives", priceDelta: 30 },
    { id: "jala", label: "Jalapeños", priceDelta: 25 },
  ]},
  addonDrink,
];
const biryaniOpts = (): OptionGroup[] => [
  { id: "size", label: "Portion", type: "single", required: true, choices: [
    { id: "half", label: "Half", priceDelta: 0 },
    { id: "full", label: "Full", priceDelta: 80 },
    { id: "family", label: "Family Pack", priceDelta: 220 },
  ]},
  spiceOpt,
  { id: "sides", label: "Sides", type: "multi", choices: [
    { id: "raita", label: "Raita", priceDelta: 25 },
    { id: "salan", label: "Mirchi ka salan", priceDelta: 40 },
    { id: "salad", label: "Salad", priceDelta: 20 },
  ]},
];
const burgerOpts = (): OptionGroup[] => [
  { id: "extras", label: "Extras", type: "multi", choices: [
    { id: "cheese", label: "Cheese slice", priceDelta: 25 },
    { id: "patty", label: "Extra patty", priceDelta: 60 },
    { id: "bacon", label: "Turkey bacon", priceDelta: 45 },
  ]},
  { id: "meal", label: "Make it a meal", type: "single", choices: [
    { id: "no", label: "Just the burger", priceDelta: 0 },
    { id: "combo", label: "+ Fries & Coke", priceDelta: 90 },
  ]},
];
const beverageOpts = (): OptionGroup[] => [
  { id: "size", label: "Size", type: "single", required: true, choices: [
    { id: "reg", label: "Regular", priceDelta: 0 },
    { id: "lg", label: "Large", priceDelta: 30 },
  ]},
  { id: "sugar", label: "Sugar", type: "single", choices: [
    { id: "no", label: "No sugar", priceDelta: 0 },
    { id: "less", label: "Less sweet", priceDelta: 0 },
    { id: "reg", label: "Regular", priceDelta: 0 },
  ]},
];
const cakeOpts = (): OptionGroup[] => [
  { id: "size", label: "Size", type: "single", required: true, choices: [
    { id: "500", label: "500 g", priceDelta: 0 },
    { id: "1000", label: "1 kg", priceDelta: 350 },
    { id: "1500", label: "1.5 kg", priceDelta: 700 },
    { id: "2000", label: "2 kg", priceDelta: 1050 },
  ]},
  { id: "egg", label: "Egg / Eggless", type: "single", required: true, choices: [
    { id: "egg", label: "With egg", priceDelta: 0 },
    { id: "eggless", label: "Eggless", priceDelta: 30 },
  ]},
  { id: "extras", label: "Add-ons", type: "multi", choices: [
    { id: "candle", label: "Candles", priceDelta: 20 },
    { id: "card", label: "Greeting card", priceDelta: 30 },
  ]},
];

// ---- Dish generation helpers ----
let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;
const rand = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface DishSeed {
  name: string; price: number; veg: boolean; cuisine: Cuisine; category: Category;
  image: string; desc: string; spice?: Spice; options?: OptionGroup[];
}

const seeds: DishSeed[] = [
  // ---------- INDIAN ----------
  // Starters
  { name: "Paneer Tikka", price: 199, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Cottage cheese cubes marinated in yogurt & spices, char-grilled.", spice: "Medium" },
  { name: "Chicken Tikka", price: 249, veg: false, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Boneless chicken chunks in tandoori masala.", spice: "Medium" },
  { name: "Veg Samosa (2 pcs)", price: 50, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.samosa), desc: "Crispy pastry stuffed with spiced potato & peas.", spice: "Mild" },
  { name: "Onion Pakora", price: 50, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.samosa), desc: "Crunchy gram-flour onion fritters.", spice: "Medium" },
  { name: "Hara Bhara Kebab", price: 149, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Spinach, peas & potato patties.", spice: "Mild" },
  { name: "Seekh Kebab", price: 229, veg: false, cuisine: "Indian", category: "Starters", image: u(IMG.kebab), desc: "Minced lamb skewers with spices.", spice: "Spicy" },
  { name: "Chicken 65", price: 199, veg: false, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Fiery South-Indian chicken bites.", spice: "Spicy" },
  { name: "Gobi Manchurian", price: 149, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.manchurian), desc: "Indo-Chinese cauliflower in spicy sauce.", spice: "Spicy" },
  { name: "Aloo Tikki Chaat", price: 99, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.samosa), desc: "Crispy potato patties with tangy chutneys.", spice: "Medium" },
  { name: "Fish Amritsari", price: 279, veg: false, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Punjabi-style batter-fried fish.", spice: "Medium" },
  { name: "Tandoori Chicken (Half)", price: 249, veg: false, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Classic tandoor-roasted chicken.", spice: "Medium" },
  { name: "Chilli Paneer", price: 179, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.paneer), desc: "Indo-Chinese fried paneer in chilli sauce.", spice: "Spicy" },
  { name: "Masala Papad", price: 50, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.samosa), desc: "Crispy papad topped with onions & tomatoes." },
  { name: "Mushroom 65", price: 99, veg: true, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Spiced batter-fried mushrooms.", spice: "Spicy" },
  { name: "Prawn Koliwada", price: 299, veg: false, cuisine: "Indian", category: "Starters", image: u(IMG.tikka), desc: "Mumbai-style crispy prawns.", spice: "Spicy" },

  // Main Course
  { name: "Butter Chicken", price: 299, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.butterChicken), desc: "Tender chicken in silky tomato-butter gravy.", spice: "Mild" },
  { name: "Paneer Butter Masala", price: 249, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.paneer), desc: "Paneer in rich tomato-cashew gravy.", spice: "Mild" },
  { name: "Dal Makhani", price: 199, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.dal), desc: "Slow-cooked black lentils with cream.", spice: "Mild" },
  { name: "Kadhai Paneer", price: 229, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.paneer), desc: "Paneer with bell peppers & kadhai masala.", spice: "Medium" },
  { name: "Chicken Curry", price: 249, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Homestyle chicken curry.", spice: "Medium" },
  { name: "Rogan Josh", price: 329, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Kashmiri lamb curry.", spice: "Medium" },
  { name: "Palak Paneer", price: 199, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.paneer), desc: "Paneer in creamy spinach gravy.", spice: "Mild" },
  { name: "Chana Masala", price: 149, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Chickpeas in tangy tomato-onion gravy.", spice: "Medium" },
  { name: "Egg Curry", price: 179, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Boiled eggs in spicy onion gravy.", spice: "Medium" },
  { name: "Fish Curry", price: 279, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Coastal-style fish in coconut gravy.", spice: "Medium" },
  { name: "Malai Kofta", price: 219, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.paneer), desc: "Paneer koftas in creamy gravy.", spice: "Mild" },
  { name: "Chicken Chettinad", price: 279, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "South-Indian fiery pepper chicken.", spice: "Spicy" },
  { name: "Aloo Gobi", price: 149, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Potato & cauliflower stir-fry.", spice: "Medium" },
  { name: "Baingan Bharta", price: 169, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Smoked mashed eggplant.", spice: "Medium" },
  { name: "Mutton Rogan Josh", price: 349, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Slow-cooked mutton in aromatic spices.", spice: "Medium" },
  { name: "Rajma Masala", price: 149, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.dal), desc: "Kidney beans in Punjabi gravy.", spice: "Medium" },
  { name: "Kadhai Chicken", price: 269, veg: false, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Chicken tossed in kadhai masala.", spice: "Medium" },
  { name: "Methi Malai Matar", price: 199, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.paneer), desc: "Fenugreek & peas in creamy gravy.", spice: "Mild" },
  { name: "Dal Tadka", price: 149, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.dal), desc: "Yellow lentils with cumin tempering.", spice: "Mild" },
  { name: "Veg Kolhapuri", price: 199, veg: true, cuisine: "Indian", category: "Main Course", image: u(IMG.curry), desc: "Mixed veg in spicy Kolhapuri masala.", spice: "Spicy" },

  // Rice/Biryani
  { name: "Chicken Biryani", price: 249, veg: false, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.biryani), desc: "Hyderabadi-style dum biryani with tender chicken.", spice: "Medium", options: biryaniOpts() },
  { name: "Mutton Biryani", price: 329, veg: false, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.biryani), desc: "Slow-cooked mutton dum biryani.", spice: "Medium", options: biryaniOpts() },
  { name: "Veg Biryani", price: 199, veg: true, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.biryani), desc: "Fragrant basmati with mixed veg.", spice: "Medium", options: biryaniOpts() },
  { name: "Egg Biryani", price: 179, veg: false, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.biryani), desc: "Basmati layered with masala eggs.", spice: "Medium", options: biryaniOpts() },
  { name: "Paneer Biryani", price: 229, veg: true, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.biryani), desc: "Paneer & basmati layered dum biryani.", spice: "Medium", options: biryaniOpts() },
  { name: "Prawn Biryani", price: 329, veg: false, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.biryani), desc: "Coastal prawn biryani.", spice: "Medium", options: biryaniOpts() },
  { name: "Jeera Rice", price: 99, veg: true, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Basmati rice tempered with cumin." },
  { name: "Kashmiri Pulao", price: 179, veg: true, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Sweet pulao with dry fruits." },
  { name: "Curd Rice", price: 99, veg: true, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "South-Indian tempered curd rice." },
  { name: "Lemon Rice", price: 99, veg: true, cuisine: "Indian", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Zesty South-Indian lemon rice." },

  // Breads
  { name: "Butter Naan", price: 50, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Tandoor-baked butter naan." },
  { name: "Garlic Naan", price: 60, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Naan topped with garlic & coriander." },
  { name: "Tandoori Roti", price: 30, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Whole-wheat tandoor bread." },
  { name: "Laccha Paratha", price: 50, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Flaky layered paratha." },
  { name: "Missi Roti", price: 50, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Gram-flour spiced roti." },
  { name: "Cheese Naan", price: 99, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Naan stuffed with mozzarella." },
  { name: "Aloo Paratha", price: 99, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Whole-wheat bread stuffed with spiced potato." },
  { name: "Kulcha", price: 60, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.naan), desc: "Punjabi-style leavened bread." },
  { name: "Masala Dosa", price: 99, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.dosa), desc: "Crispy dosa with spiced potato filling." },
  { name: "Plain Dosa", price: 79, veg: true, cuisine: "Indian", category: "Breads", image: u(IMG.dosa), desc: "Classic crispy dosa." },

  // Combos
  { name: "North Indian Thali", price: 249, veg: true, cuisine: "Indian", category: "Combos", image: u(IMG.thali), desc: "Dal, sabzi, rice, roti, raita & dessert.", spice: "Mild" },
  { name: "South Indian Thali", price: 229, veg: true, cuisine: "Indian", category: "Combos", image: u(IMG.thali), desc: "Sambar, rasam, rice, poriyal & payasam.", spice: "Medium" },
  { name: "Non-Veg Thali", price: 349, veg: false, cuisine: "Indian", category: "Combos", image: u(IMG.thali), desc: "Chicken curry, dal, rice, roti & dessert.", spice: "Medium" },
  { name: "Biryani + Coke Combo", price: 299, veg: false, cuisine: "Indian", category: "Combos", image: u(IMG.biryani), desc: "Chicken biryani + 250ml Coke." },
  { name: "Dal Rice Combo", price: 99, veg: true, cuisine: "Indian", category: "Combos", image: u(IMG.dal), desc: "Comfort dal & rice combo." },

  // ---------- CHINESE ----------
  { name: "Veg Hakka Noodles", price: 149, veg: true, cuisine: "Chinese", category: "Main Course", image: u(IMG.chowmein), desc: "Wok-tossed noodles with veggies.", spice: "Medium" },
  { name: "Chicken Hakka Noodles", price: 179, veg: false, cuisine: "Chinese", category: "Main Course", image: u(IMG.chowmein), desc: "Chicken & noodles wok-tossed.", spice: "Medium" },
  { name: "Schezwan Noodles", price: 169, veg: true, cuisine: "Chinese", category: "Main Course", image: u(IMG.chowmein), desc: "Spicy Schezwan sauce noodles.", spice: "Spicy" },
  { name: "Egg Fried Rice", price: 149, veg: false, cuisine: "Chinese", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Wok-tossed rice with egg." },
  { name: "Chicken Fried Rice", price: 179, veg: false, cuisine: "Chinese", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Rice tossed with chicken & sauces." },
  { name: "Veg Fried Rice", price: 129, veg: true, cuisine: "Chinese", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Wok-tossed rice with vegetables." },
  { name: "Schezwan Fried Rice", price: 149, veg: true, cuisine: "Chinese", category: "Rice/Biryani", image: u(IMG.friedRice), desc: "Fried rice with Schezwan kick.", spice: "Spicy" },
  { name: "Chicken Manchurian (Dry)", price: 199, veg: false, cuisine: "Chinese", category: "Starters", image: u(IMG.manchurian), desc: "Battered chicken in tangy sauce.", spice: "Medium" },
  { name: "Veg Manchurian (Gravy)", price: 149, veg: true, cuisine: "Chinese", category: "Main Course", image: u(IMG.manchurian), desc: "Veg dumplings in Manchurian gravy.", spice: "Medium" },
  { name: "Honey Chilli Potato", price: 149, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.manchurian), desc: "Crispy potato in honey-chilli glaze.", spice: "Medium" },
  { name: "Veg Spring Roll", price: 99, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.springRoll), desc: "Crispy rolls with veg filling." },
  { name: "Chicken Spring Roll", price: 129, veg: false, cuisine: "Chinese", category: "Starters", image: u(IMG.springRoll), desc: "Crispy rolls with chicken filling." },
  { name: "Veg Dimsum (6 pcs)", price: 179, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.dimsum), desc: "Steamed veg dumplings." },
  { name: "Chicken Dimsum (6 pcs)", price: 229, veg: false, cuisine: "Chinese", category: "Starters", image: u(IMG.dimsum), desc: "Steamed chicken dumplings." },
  { name: "Chilli Chicken", price: 219, veg: false, cuisine: "Chinese", category: "Starters", image: u(IMG.manchurian), desc: "Indo-Chinese chilli chicken.", spice: "Spicy" },
  { name: "Kung Pao Chicken", price: 249, veg: false, cuisine: "Chinese", category: "Main Course", image: u(IMG.manchurian), desc: "Chicken with peanuts in spicy sauce.", spice: "Spicy" },
  { name: "Sweet & Sour Chicken", price: 229, veg: false, cuisine: "Chinese", category: "Main Course", image: u(IMG.manchurian), desc: "Chicken in tangy-sweet sauce.", spice: "Mild" },
  { name: "Hot & Sour Soup", price: 99, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.dimsum), desc: "Tangy & peppery soup.", spice: "Spicy" },
  { name: "Sweet Corn Soup", price: 99, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.dimsum), desc: "Comforting sweet corn soup." },
  { name: "Manchow Soup", price: 99, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.dimsum), desc: "Spicy Indo-Chinese soup with noodles.", spice: "Spicy" },
  { name: "Chow Mein Combo", price: 249, veg: false, cuisine: "Chinese", category: "Combos", image: u(IMG.chowmein), desc: "Noodles + chicken manchurian + drink." },
  { name: "Fried Rice Combo", price: 229, veg: true, cuisine: "Chinese", category: "Combos", image: u(IMG.friedRice), desc: "Fried rice + veg manchurian + drink." },
  { name: "Schezwan Paneer", price: 199, veg: true, cuisine: "Chinese", category: "Main Course", image: u(IMG.paneer), desc: "Paneer tossed in Schezwan sauce.", spice: "Spicy" },
  { name: "Crispy Chilli Baby Corn", price: 149, veg: true, cuisine: "Chinese", category: "Starters", image: u(IMG.manchurian), desc: "Baby corn in sweet-spicy sauce.", spice: "Medium" },
  { name: "American Chopsuey", price: 179, veg: true, cuisine: "Chinese", category: "Main Course", image: u(IMG.chowmein), desc: "Crispy noodles topped with sweet-sour sauce." },

  // ---------- ARABIAN ----------
  { name: "Chicken Shawarma Roll", price: 149, veg: false, cuisine: "Arabian", category: "Starters", image: u(IMG.shawarma), desc: "Grilled chicken wrapped with garlic sauce.", spice: "Mild" },
  { name: "Falafel Wrap", price: 129, veg: true, cuisine: "Arabian", category: "Starters", image: u(IMG.wrap), desc: "Crispy falafel with tahini in pita.", spice: "Mild" },
  { name: "Hummus & Pita", price: 149, veg: true, cuisine: "Arabian", category: "Starters", image: u(IMG.hummus), desc: "Creamy chickpea dip with warm pita." },
  { name: "Baba Ganoush", price: 149, veg: true, cuisine: "Arabian", category: "Starters", image: u(IMG.hummus), desc: "Smoky eggplant dip with pita." },
  { name: "Chicken Mandi", price: 349, veg: false, cuisine: "Arabian", category: "Rice/Biryani", image: u(IMG.mandi), desc: "Yemeni-style smoky rice with chicken.", spice: "Mild" },
  { name: "Mutton Mandi", price: 449, veg: false, cuisine: "Arabian", category: "Rice/Biryani", image: u(IMG.mandi), desc: "Slow-cooked mutton with mandi rice.", spice: "Mild" },
  { name: "Chicken Kabsa", price: 349, veg: false, cuisine: "Arabian", category: "Rice/Biryani", image: u(IMG.mandi), desc: "Saudi spiced rice with chicken.", spice: "Medium" },
  { name: "Lamb Kabsa", price: 449, veg: false, cuisine: "Arabian", category: "Rice/Biryani", image: u(IMG.mandi), desc: "Saudi spiced rice with lamb.", spice: "Medium" },
  { name: "Chicken Shish Tawook", price: 279, veg: false, cuisine: "Arabian", category: "Main Course", image: u(IMG.kebab), desc: "Levantine grilled chicken skewers.", spice: "Mild" },
  { name: "Lamb Kofta", price: 299, veg: false, cuisine: "Arabian", category: "Main Course", image: u(IMG.kebab), desc: "Minced lamb kofta skewers.", spice: "Medium" },
  { name: "Mixed Grill Platter", price: 549, veg: false, cuisine: "Arabian", category: "Combos", image: u(IMG.kebab), desc: "Assortment of grilled meats with pita.", spice: "Medium" },
  { name: "Falafel Platter", price: 229, veg: true, cuisine: "Arabian", category: "Combos", image: u(IMG.falafel), desc: "Falafel with hummus, salad & pita." },
  { name: "Chicken Shawarma Plate", price: 249, veg: false, cuisine: "Arabian", category: "Main Course", image: u(IMG.shawarma), desc: "Shawarma meat with rice, salad & sauces.", spice: "Mild" },
  { name: "Fattoush Salad", price: 149, veg: true, cuisine: "Arabian", category: "Starters", image: u(IMG.hummus), desc: "Fresh Levantine salad with crispy pita." },
  { name: "Tabouleh", price: 149, veg: true, cuisine: "Arabian", category: "Starters", image: u(IMG.hummus), desc: "Parsley & bulgur salad with lemon." },
  { name: "Arabic Bread (Khubz)", price: 30, veg: true, cuisine: "Arabian", category: "Breads", image: u(IMG.naan), desc: "Soft round Arabic flatbread." },
  { name: "Manakish Zaatar", price: 99, veg: true, cuisine: "Arabian", category: "Breads", image: u(IMG.naan), desc: "Zaatar-topped Levantine flatbread." },
  { name: "Chicken Musakhan", price: 329, veg: false, cuisine: "Arabian", category: "Main Course", image: u(IMG.mandi), desc: "Palestinian sumac chicken on flatbread.", spice: "Mild" },
  { name: "Machboos", price: 349, veg: false, cuisine: "Arabian", category: "Rice/Biryani", image: u(IMG.mandi), desc: "Bahraini spiced rice with chicken.", spice: "Medium" },
  { name: "Falafel (6 pcs)", price: 99, veg: true, cuisine: "Arabian", category: "Starters", image: u(IMG.falafel), desc: "Crispy chickpea patties." },
  { name: "Beef Shawarma Roll", price: 179, veg: false, cuisine: "Arabian", category: "Starters", image: u(IMG.shawarma), desc: "Grilled beef shawarma wrap.", spice: "Mild" },
  { name: "Arabian Grill Combo", price: 449, veg: false, cuisine: "Arabian", category: "Combos", image: u(IMG.kebab), desc: "Shish tawook + kofta + rice + hummus." },

  // ---------- CONTINENTAL / PIZZA / BURGER ----------
  { name: "Margherita Pizza", price: 199, veg: true, cuisine: "Continental", category: "Main Course", image: u(IMG.pizza), desc: "Classic tomato-mozzarella pizza.", options: pizzaOpts() },
  { name: "Farmhouse Pizza", price: 249, veg: true, cuisine: "Continental", category: "Main Course", image: u(IMG.pizza), desc: "Loaded with fresh vegetables.", options: pizzaOpts() },
  { name: "Peri Peri Chicken Pizza", price: 299, veg: false, cuisine: "Continental", category: "Main Course", image: u(IMG.pizza), desc: "Spicy peri peri chicken pizza.", spice: "Spicy", options: pizzaOpts() },
  { name: "BBQ Chicken Pizza", price: 299, veg: false, cuisine: "Continental", category: "Main Course", image: u(IMG.pizza), desc: "Smoky BBQ chicken with red onions.", options: pizzaOpts() },
  { name: "Classic Veg Burger", price: 99, veg: true, cuisine: "Continental", category: "Main Course", image: u(IMG.burger), desc: "Crispy veg patty with lettuce & sauce.", options: burgerOpts() },
  { name: "Cheese Burst Chicken Burger", price: 179, veg: false, cuisine: "Continental", category: "Main Course", image: u(IMG.burger), desc: "Chicken patty with molten cheese.", options: burgerOpts() },
  { name: "Peri Peri Fries", price: 99, veg: true, cuisine: "Continental", category: "Starters", image: u(IMG.fries), desc: "Fries tossed with peri peri seasoning.", spice: "Medium" },
  { name: "Cheesy Fries", price: 149, veg: true, cuisine: "Continental", category: "Starters", image: u(IMG.fries), desc: "Fries loaded with cheese sauce." },

  // ---------- BEVERAGES ----------
  { name: "Sweet Lassi", price: 79, veg: true, cuisine: "Indian", category: "Beverages", image: u(IMG.lassi), desc: "Chilled sweetened yogurt drink.", options: beverageOpts() },
  { name: "Mango Lassi", price: 99, veg: true, cuisine: "Indian", category: "Beverages", image: u(IMG.lassi), desc: "Alphonso mango lassi.", options: beverageOpts() },
  { name: "Masala Chai", price: 50, veg: true, cuisine: "Indian", category: "Beverages", image: u(IMG.tea), desc: "Cutting chai with spices." },
  { name: "Filter Coffee", price: 60, veg: true, cuisine: "Indian", category: "Beverages", image: u(IMG.coffee), desc: "South-Indian filter coffee." },
  { name: "Fresh Lime Soda", price: 79, veg: true, cuisine: "Indian", category: "Beverages", image: u(IMG.juice), desc: "Sweet & salty lime soda." },
  { name: "Cold Coffee", price: 129, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.coffee), desc: "Blended chilled coffee with ice-cream.", options: beverageOpts() },
  { name: "Cappuccino", price: 129, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.coffee), desc: "Espresso topped with velvet foam." },
  { name: "Coke (250ml)", price: 50, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.softdrink), desc: "Chilled classic Coke." },
  { name: "Sprite (250ml)", price: 50, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.softdrink), desc: "Chilled Sprite." },
  { name: "Mineral Water (1L)", price: 50, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.water), desc: "Packaged drinking water." },
  { name: "Fresh Orange Juice", price: 99, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.juice), desc: "Freshly squeezed oranges." },
  { name: "Watermelon Juice", price: 99, veg: true, cuisine: "Continental", category: "Beverages", image: u(IMG.juice), desc: "Fresh watermelon juice." },
  { name: "Arabian Mint Lemonade", price: 99, veg: true, cuisine: "Arabian", category: "Beverages", image: u(IMG.juice), desc: "Chilled mint & lemon cooler.", options: beverageOpts() },
  { name: "Rose Milk", price: 79, veg: true, cuisine: "Indian", category: "Beverages", image: u(IMG.lassi), desc: "Chilled rose-flavored milk." },
  { name: "Bubble Tea", price: 149, veg: true, cuisine: "Chinese", category: "Beverages", image: u(IMG.tea), desc: "Milk tea with tapioca pearls.", options: beverageOpts() },
];

// Extra filler dishes to reach ~200
const filler: DishSeed[] = [];
const fillerDefs: Array<[string, number, boolean, Cuisine, Category, string, string]> = [
  ["Egg Roll", 79, false, "Indian", "Starters", u(IMG.wrap), "Egg wrapped in flaky paratha."],
  ["Kathi Roll", 99, false, "Indian", "Starters", u(IMG.wrap), "Kolkata-style chicken kathi roll."],
  ["Veg Momos (6)", 99, true, "Chinese", "Starters", u(IMG.dimsum), "Steamed veg dumplings with chutney."],
  ["Chicken Momos (6)", 129, false, "Chinese", "Starters", u(IMG.dimsum), "Steamed chicken dumplings."],
  ["Pav Bhaji", 129, true, "Indian", "Main Course", u(IMG.curry), "Mumbai-style spiced veg mash with pav."],
  ["Chole Bhature", 149, true, "Indian", "Main Course", u(IMG.curry), "Fluffy bhature with spiced chickpeas."],
  ["Idli Sambar", 79, true, "Indian", "Main Course", u(IMG.dosa), "Steamed idli with sambar & chutney."],
  ["Medu Vada", 79, true, "Indian", "Starters", u(IMG.samosa), "Crispy lentil doughnuts."],
  ["Uttapam", 99, true, "Indian", "Main Course", u(IMG.dosa), "Thick pancake with onions & tomatoes."],
  ["Rava Dosa", 129, true, "Indian", "Main Course", u(IMG.dosa), "Crispy semolina dosa."],
  ["Paneer Roll", 129, true, "Indian", "Starters", u(IMG.wrap), "Paneer tikka wrapped in paratha."],
  ["Fish Fry", 249, false, "Indian", "Starters", u(IMG.tikka), "Coastal-style spiced fish fry."],
  ["Prawn Curry", 299, false, "Indian", "Main Course", u(IMG.curry), "Coastal prawn coconut curry."],
  ["Chicken Wings", 249, false, "Continental", "Starters", u(IMG.tikka), "Buffalo-style spicy wings."],
  ["Garlic Bread", 99, true, "Continental", "Starters", u(IMG.naan), "Toasted garlic bread with herbs."],
  ["Nachos with Salsa", 179, true, "Continental", "Starters", u(IMG.fries), "Tortilla chips with salsa & cheese."],
  ["Cheese Sandwich", 99, true, "Continental", "Starters", u(IMG.burger), "Grilled cheese sandwich."],
  ["Club Sandwich", 179, false, "Continental", "Main Course", u(IMG.burger), "Triple decker with chicken & egg."],
  ["Veg Wrap", 99, true, "Continental", "Starters", u(IMG.wrap), "Veg patty wrapped in tortilla."],
  ["Chicken Wrap", 149, false, "Continental", "Main Course", u(IMG.wrap), "Grilled chicken wrap with mayo."],
  ["Pasta Alfredo", 199, true, "Continental", "Main Course", u(IMG.pizza), "Penne in creamy Alfredo sauce."],
  ["Pasta Arrabbiata", 199, true, "Continental", "Main Course", u(IMG.pizza), "Penne in spicy tomato sauce.", ],
  ["Chicken Lasagna", 249, false, "Continental", "Main Course", u(IMG.pizza), "Layered pasta with chicken & cheese."],
  ["Veg Momos Fried (6)", 129, true, "Chinese", "Starters", u(IMG.dimsum), "Crispy fried veg dumplings."],
  ["Chicken Momos Fried (6)", 149, false, "Chinese", "Starters", u(IMG.dimsum), "Crispy fried chicken dumplings."],
  ["Schezwan Momos", 149, true, "Chinese", "Starters", u(IMG.dimsum), "Momos tossed in Schezwan sauce."],
  ["Thukpa", 179, true, "Chinese", "Main Course", u(IMG.chowmein), "Himalayan noodle soup."],
  ["Chicken Thukpa", 199, false, "Chinese", "Main Course", u(IMG.chowmein), "Chicken noodle soup."],
  ["Veg Manchow Soup", 99, true, "Chinese", "Starters", u(IMG.dimsum), "Spicy veg soup with crispy noodles."],
  ["Chicken Sweet Corn Soup", 129, false, "Chinese", "Starters", u(IMG.dimsum), "Chicken & sweet corn broth."],
  ["Shawarma Platter", 279, false, "Arabian", "Combos", u(IMG.shawarma), "Shawarma meat + rice + salad + pita."],
  ["Falafel Salad Bowl", 199, true, "Arabian", "Main Course", u(IMG.falafel), "Falafel over greens with tahini."],
  ["Mutabbal", 149, true, "Arabian", "Starters", u(IMG.hummus), "Smoky eggplant & yogurt dip."],
  ["Zaatar Manakish", 99, true, "Arabian", "Breads", u(IMG.naan), "Flatbread topped with zaatar."],
  ["Cheese Manakish", 129, true, "Arabian", "Breads", u(IMG.naan), "Flatbread topped with akkawi cheese."],
  ["Arabic Salad", 99, true, "Arabian", "Starters", u(IMG.hummus), "Cucumber, tomato & parsley salad."],
  ["Iced Tea", 79, true, "Continental", "Beverages", u(IMG.tea), "Chilled lemon iced tea."],
  ["Green Tea", 60, true, "Chinese", "Beverages", u(IMG.tea), "Delicate green tea."],
  ["Latte", 129, true, "Continental", "Beverages", u(IMG.coffee), "Espresso with steamed milk."],
  ["Espresso", 99, true, "Continental", "Beverages", u(IMG.coffee), "Bold single-shot espresso."],
  ["Buttermilk", 50, true, "Indian", "Beverages", u(IMG.lassi), "Spiced South-Indian buttermilk."],
  ["Jaljeera", 50, true, "Indian", "Beverages", u(IMG.juice), "Tangy cumin cooler."],
  ["Nimbu Pani", 50, true, "Indian", "Beverages", u(IMG.juice), "Classic Indian lemonade."],
  ["Kingfisher Soda", 50, true, "Continental", "Beverages", u(IMG.softdrink), "Chilled club soda."],
  ["Thums Up (250ml)", 50, true, "Continental", "Beverages", u(IMG.softdrink), "Strong Indian cola."],
  ["Redbull", 149, true, "Continental", "Beverages", u(IMG.softdrink), "Energy drink 250ml."],
];
fillerDefs.forEach(([name, price, veg, cuisine, category, image, desc]) => {
  filler.push({ name, price, veg, cuisine, category, image, desc });
});

const allSeeds = [...seeds, ...filler];

const dishes: Dish[] = allSeeds.map((s, i) => {
  const id = nextId("d");
  const rating = 3.8 + rand(i + 1) * 1.1;
  const popularity = Math.floor(50 + rand(i + 10) * 950);
  return {
    id,
    name: s.name,
    price: s.price,
    veg: s.veg,
    cuisine: s.cuisine,
    category: s.category,
    rating: Math.round(rating * 10) / 10,
    description: s.desc,
    image: s.image,
    spice: s.spice,
    options: s.options,
    kind: "dish",
    popularity,
  };
});

// ---------- DESSERTS ----------
interface DessertSeed {
  name: string; price: number; veg: boolean; cuisine: Cuisine;
  type: NonNullable<Dish["dessertType"]>; image: string; desc: string;
  flavor?: string; eggless?: boolean; options?: OptionGroup[];
}
const dessertSeeds: DessertSeed[] = [
  // Cakes (with full customization)
  { name: "Chocolate Truffle Cake", price: 499, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cakeChoc), desc: "Rich chocolate ganache cake.", flavor: "Chocolate", options: cakeOpts() },
  { name: "Red Velvet Cake", price: 549, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cakeRedVelvet), desc: "Classic red velvet with cream cheese.", flavor: "Red Velvet", options: cakeOpts() },
  { name: "Vanilla Bean Cake", price: 449, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cakeVanilla), desc: "Fluffy vanilla sponge with buttercream.", flavor: "Vanilla", options: cakeOpts() },
  { name: "Black Forest Cake", price: 499, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cake), desc: "Cherries, cream & chocolate sponge.", flavor: "Black Forest", options: cakeOpts() },
  { name: "Butterscotch Crunch Cake", price: 499, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cake), desc: "Butterscotch crunch & caramel.", flavor: "Butterscotch", options: cakeOpts() },
  { name: "Pineapple Cake", price: 449, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cake), desc: "Light pineapple sponge with cream.", flavor: "Pineapple", options: cakeOpts() },
  { name: "Fresh Fruit Cake", price: 599, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cake), desc: "Loaded with seasonal fresh fruits.", flavor: "Fresh Fruit", options: cakeOpts() },
  { name: "Coffee Mocha Cake", price: 499, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cakeChoc), desc: "Espresso-infused sponge with mocha ganache.", flavor: "Coffee", options: cakeOpts() },
  { name: "Choco Lava Cake", price: 149, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cakeChoc), desc: "Molten chocolate centre cake.", flavor: "Chocolate", eggless: false },
  { name: "Rainbow Cake", price: 699, veg: true, cuisine: "Continental", type: "Cakes", image: u(IMG.cake), desc: "Six-layer rainbow sponge cake.", flavor: "Vanilla", options: cakeOpts() },

  // Pastries
  { name: "Chocolate Pastry", price: 99, veg: true, cuisine: "Continental", type: "Pastries", image: u(IMG.pastry), desc: "Slice of chocolate cream cake." },
  { name: "Strawberry Pastry", price: 99, veg: true, cuisine: "Continental", type: "Pastries", image: u(IMG.pastry), desc: "Strawberry & vanilla cream slice." },
  { name: "Blueberry Cheesecake Slice", price: 149, veg: true, cuisine: "Continental", type: "Pastries", image: u(IMG.pastry), desc: "Baked cheesecake with blueberry glaze." },
  { name: "Tiramisu Cup", price: 179, veg: true, cuisine: "Continental", type: "Pastries", image: u(IMG.pastry), desc: "Layered coffee mascarpone dessert." },
  { name: "Cinnamon Roll", price: 99, veg: true, cuisine: "Continental", type: "Pastries", image: u(IMG.pastry), desc: "Warm cinnamon roll with glaze." },

  // Ice Cream
  { name: "Vanilla Scoop", price: 50, veg: true, cuisine: "Continental", type: "Ice Cream", image: u(IMG.icecream), desc: "Single scoop of vanilla bean." },
  { name: "Chocolate Scoop", price: 50, veg: true, cuisine: "Continental", type: "Ice Cream", image: u(IMG.icecream), desc: "Rich chocolate ice cream scoop." },
  { name: "Strawberry Scoop", price: 50, veg: true, cuisine: "Continental", type: "Ice Cream", image: u(IMG.icecream), desc: "Fresh strawberry ice cream scoop." },
  { name: "Belgian Chocolate Tub", price: 249, veg: true, cuisine: "Continental", type: "Ice Cream", image: u(IMG.icecream), desc: "500ml tub of Belgian chocolate." },
  { name: "Sundae Special", price: 199, veg: true, cuisine: "Continental", type: "Ice Cream", image: u(IMG.icecream), desc: "Ice cream sundae with nuts & syrup." },
  { name: "Kesar Pista Kulfi", price: 79, veg: true, cuisine: "Indian", type: "Ice Cream", image: u(IMG.kulfi), desc: "Saffron pistachio kulfi." },
  { name: "Malai Kulfi", price: 79, veg: true, cuisine: "Indian", type: "Ice Cream", image: u(IMG.kulfi), desc: "Rich creamy malai kulfi." },

  // Indian Sweets
  { name: "Gulab Jamun (2 pcs)", price: 50, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.gulab), desc: "Warm khoya balls in rose syrup." },
  { name: "Rasmalai (2 pcs)", price: 99, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.rasmalai), desc: "Chena discs in saffron milk." },
  { name: "Jalebi (250g)", price: 99, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.jalebi), desc: "Crispy syrup-soaked spirals." },
  { name: "Motichoor Laddoo (2)", price: 50, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.laddoo), desc: "Melt-in-mouth boondi laddoos." },
  { name: "Kaju Katli (250g)", price: 249, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.laddoo), desc: "Diamond-cut cashew fudge." },
  { name: "Rasgulla (2 pcs)", price: 50, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.rasmalai), desc: "Spongy chena balls in sugar syrup." },
  { name: "Gajar Ka Halwa", price: 129, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.gulab), desc: "Slow-cooked carrot halwa with khoya." },
  { name: "Moong Dal Halwa", price: 149, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.gulab), desc: "Rich moong dal halwa with ghee." },
  { name: "Sooji Halwa", price: 79, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.gulab), desc: "Comforting semolina halwa." },
  { name: "Kheer", price: 99, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.rasmalai), desc: "Rice pudding with cardamom & nuts." },
  { name: "Barfi Assortment (250g)", price: 199, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.laddoo), desc: "Assorted milk fudge squares." },
  { name: "Mysore Pak (200g)", price: 149, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.laddoo), desc: "Ghee-loaded gram flour fudge." },
  { name: "Balushahi (2)", price: 50, veg: true, cuisine: "Indian", type: "Indian Sweets", image: u(IMG.jalebi), desc: "Flaky syrup-glazed sweet." },

  // Brownies / Cookies
  { name: "Fudge Brownie", price: 99, veg: true, cuisine: "Continental", type: "Brownies/Cookies", image: u(IMG.brownie), desc: "Dense chocolate brownie square." },
  { name: "Walnut Brownie", price: 129, veg: true, cuisine: "Continental", type: "Brownies/Cookies", image: u(IMG.brownie), desc: "Brownie loaded with walnuts." },
  { name: "Brownie with Ice Cream", price: 179, veg: true, cuisine: "Continental", type: "Brownies/Cookies", image: u(IMG.brownie), desc: "Warm brownie with a scoop of vanilla." },
  { name: "Choco Chip Cookie", price: 50, veg: true, cuisine: "Continental", type: "Brownies/Cookies", image: u(IMG.cookie), desc: "Classic choc-chip cookie." },
  { name: "Oatmeal Raisin Cookie", price: 50, veg: true, cuisine: "Continental", type: "Brownies/Cookies", image: u(IMG.cookie), desc: "Chewy oatmeal & raisin cookie." },
  { name: "Double Chocolate Cookie", price: 79, veg: true, cuisine: "Continental", type: "Brownies/Cookies", image: u(IMG.cookie), desc: "Extra fudgy chocolate cookie." },

  // Middle-Eastern
  { name: "Baklava (4 pcs)", price: 199, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.baklava), desc: "Layered phyllo with pistachios & syrup." },
  { name: "Pistachio Baklava (250g)", price: 349, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.baklava), desc: "Premium pistachio baklava assortment." },
  { name: "Kunafa (Slice)", price: 179, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.kunafa), desc: "Cheese-filled semolina dessert in syrup." },
  { name: "Nutella Kunafa", price: 229, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.kunafa), desc: "Kunafa with a molten nutella centre." },
  { name: "Basbousa", price: 99, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.baklava), desc: "Semolina cake soaked in syrup." },
  { name: "Muhalabia", price: 129, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.rasmalai), desc: "Levantine milk pudding with rose water." },
  { name: "Umm Ali", price: 179, veg: true, cuisine: "Arabian", type: "Middle-Eastern", image: u(IMG.rasmalai), desc: "Egyptian bread pudding with nuts." },

  // Others
  { name: "Choco Doughnut", price: 79, veg: true, cuisine: "Continental", type: "Others", image: u(IMG.pastry), desc: "Glazed chocolate doughnut." },
  { name: "Waffle with Nutella", price: 199, veg: true, cuisine: "Continental", type: "Others", image: u(IMG.pastry), desc: "Belgian waffle with nutella drizzle." },
];

const desserts: Dish[] = dessertSeeds.map((d, i) => {
  const id = nextId("s");
  const rating = 4.0 + rand(i + 100) * 0.9;
  const popularity = Math.floor(30 + rand(i + 300) * 700);
  return {
    id,
    name: d.name,
    price: d.price,
    veg: d.veg,
    cuisine: d.cuisine,
    category: "Desserts",
    rating: Math.round(rating * 10) / 10,
    description: d.desc,
    image: d.image,
    options: d.options,
    kind: "dessert",
    dessertType: d.type,
    flavor: d.flavor,
    eggless: d.eggless,
    popularity,
  };
});

export const ALL_ITEMS: Dish[] = [...dishes, ...desserts];

// Mark ~18 most-popular items as "Selling Hot" and cap popularity display.
ALL_ITEMS
  .slice()
  .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
  .slice(0, 18)
  .forEach((item) => {
    item.isSellingHot = true;
  });

export const DISHES = dishes;
export const DESSERTS = desserts;

export function getItem(id: string): Dish | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

export const CUISINES: Cuisine[] = ["Indian", "Chinese", "Arabian", "Continental"];
export const CATEGORIES: Category[] = ["Starters", "Main Course", "Rice/Biryani", "Breads", "Beverages", "Combos", "Desserts"];
export const DESSERT_TYPES = ["Cakes", "Pastries", "Ice Cream", "Indian Sweets", "Brownies/Cookies", "Middle-Eastern", "Others"] as const;
export const CAKE_FLAVORS = ["Chocolate", "Red Velvet", "Vanilla", "Black Forest", "Butterscotch", "Pineapple", "Fresh Fruit", "Coffee"] as const;

export const PRICE_BUCKETS = [
  { id: "u50", label: "Under ₹50", test: (p: number) => p < 50 },
  { id: "50-99", label: "₹50–₹99", test: (p: number) => p >= 50 && p < 99 },
  { id: "99", label: "₹99 Only", test: (p: number) => p === 99 },
  { id: "100-199", label: "₹100–₹199", test: (p: number) => p >= 100 && p < 200 },
  { id: "200p", label: "₹200+", test: (p: number) => p >= 200 },
] as const;

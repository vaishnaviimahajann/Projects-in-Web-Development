const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'HD Air Fryer 5.2L', brand: 'Philips', category: 'kitchen', price: 7999, originalPrice: 12500, rating: 4.9, reviews: 1200, emoji: '🍳', tag: 'hot', inStock: true },
  { id: 2, name: 'Espresso Coffee Maker', brand: 'DeLonghi', category: 'kitchen', price: 14299, originalPrice: 19000, rating: 4.4, reviews: 876, emoji: '☕', tag: 'new', inStock: true },
  { id: 3, name: 'Cyclone V11 Vacuum', brand: 'Dyson', category: 'accessories', price: 38990, originalPrice: 49900, rating: 5.0, reviews: 2400, emoji: '🌀', tag: 'sale', inStock: true },
  { id: 4, name: 'French Door Fridge 591L', brand: 'Samsung', category: 'refrigerators', price: 89990, originalPrice: 105000, rating: 5.0, reviews: 543, emoji: '🧊', tag: 'hot', inStock: true },
  { id: 5, name: 'WH-1000XM5 Headphones', brand: 'Sony', category: 'entertainment', price: 24990, originalPrice: 34990, rating: 5.0, reviews: 3100, emoji: '🎧', tag: 'new', inStock: true },
  { id: 6, name: 'Smart Bulb Starter Kit', brand: 'Philips Hue', category: 'accessories', price: 4299, originalPrice: 6500, rating: 4.2, reviews: 988, emoji: '💡', tag: 'sale', inStock: true },
  { id: 7, name: 'OTG Baking Oven 52L', brand: 'Morphy Richards', category: 'kitchen', price: 9799, originalPrice: 14000, rating: 4.3, reviews: 729, emoji: '🍞', tag: 'hot', inStock: false },
  { id: 8, name: 'Roomba j9+ Robot Vacuum', brand: 'iRobot', category: 'accessories', price: 64900, originalPrice: 79900, rating: 5.0, reviews: 1800, emoji: '🤖', tag: 'new', inStock: true },
];

const categories = [
  { id: 'kitchen', name: 'Kitchen', emoji: '🍳', count: 1240 },
  { id: 'refrigerators', name: 'Refrigerators', emoji: '❄️', count: 340 },
  { id: 'washing', name: 'Washing Machines', emoji: '👕', count: 185 },
  { id: 'aircon', name: 'Air Conditioners', emoji: '🌀', count: 290 },
  { id: 'entertainment', name: 'Entertainment', emoji: '📺', count: 620 },
  { id: 'accessories', name: 'Accessories', emoji: '🔌', count: 2100 },
];

let cart = [];
let orders = [];

// PRODUCTS
router.get('/products', (req, res) => {
  let result = [...products];
  const { category, tag, search, minPrice, maxPrice, sort } = req.query;

  if (category) result = result.filter(p => p.category === category);
  if (tag)      result = result.filter(p => p.tag === tag);
  if (search)   result = result.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
  if (sort === 'price_asc')  result.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);

  res.json({ success: true, count: result.length, products: result });
});

router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// CATEGORIES
router.get('/categories', (req, res) => {
  res.json({ success: true, categories });
});

// CART
router.get('/cart', (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ success: true, items: cart, total, itemCount: cart.length });
});

router.post('/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: 'productId required' });

  const product = products.find(p => p.id === Number(productId));
  if (!product)       return res.status(404).json({ success: false, message: 'Product not found' });
  if (!product.inStock) return res.status(400).json({ success: false, message: 'Out of stock' });

  const existing = cart.find(i => i.productId === Number(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId: Number(productId), name: product.name, brand: product.brand, price: product.price, emoji: product.emoji, quantity });
  }
  res.json({ success: true, message: 'Item added to cart', cart });
});

router.put('/cart/:productId', (req, res) => {
  const { quantity } = req.body;
  const item = cart.find(i => i.productId === Number(req.params.productId));
  if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

  if (quantity <= 0) {
    cart = cart.filter(i => i.productId !== Number(req.params.productId));
    return res.json({ success: true, message: 'Item removed', cart });
  }
  item.quantity = quantity;
  res.json({ success: true, cart });
});

router.delete('/cart/:productId', (req, res) => {
  cart = cart.filter(i => i.productId !== Number(req.params.productId));
  res.json({ success: true, message: 'Item removed', cart });
});

router.delete('/cart', (req, res) => {
  cart = [];
  res.json({ success: true, message: 'Cart cleared' });
});

// ORDERS
router.post('/orders', (req, res) => {
  const { name, email, address, phone, paymentMethod = 'COD' } = req.body;

  if (!name || !email || !address || !phone)
    return res.status(400).json({ success: false, message: 'All fields required: name, email, address, phone' });

  if (cart.length === 0)
    return res.status(400).json({ success: false, message: 'Cart is empty' });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: `ORD-${Date.now()}`,
    items: [...cart],
    total,
    customer: { name, email, address, phone },
    paymentMethod,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  cart = [];
  res.status(201).json({ success: true, message: 'Order placed!', order });
});

router.get('/orders', (req, res) => {
  res.json({ success: true, count: orders.length, orders });
});

router.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

// HEALTH
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'ElectroNest API running 🚀', time: new Date().toISOString() });
});

module.exports = router;
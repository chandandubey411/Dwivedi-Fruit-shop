import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected correctly to trigger seeding...');
  } catch (error) {
    console.error('Error connecting to DB:', error.message);
    process.exit(1);
  }
};

const fruitsData = [
  { name: 'Kashmir Apples (1kg)', category: 'Fruits', price: 180, countInStock: 50, description: 'Crisp, sweet, and perfectly red apples freshly harvested from Kashmir.', images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80'], type: 'single', tags: ['Best Seller'] },
  { name: 'Robusta Bananas (1 Dozen)', category: 'Fruits', price: 60, countInStock: 100, description: 'Premium quality yellow robusta bananas loaded with energy.', images: ['https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Nagpur Oranges (1kg)', category: 'Fruits', price: 120, countInStock: 40, description: 'Juicy, tangy and farm-fresh Nagpur oranges bursting with Vitamin C.', images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Alphonso Mango (1 Dozen)', category: 'Seasonal Fruits', price: 850, countInStock: 20, description: 'The undisputed king of fruits. Pure, unadulterated sweet Alphonso mangoes.', images: ['https://images.unsplash.com/photo-1553279768-865429fd0072?w=600&q=80'], type: 'single', tags: ['Festival Special'] },
  { name: 'Green Seedless Grapes (500g)', category: 'Fruits', price: 110, countInStock: 60, description: 'Sweet, perfectly green seedless grapes ideal for a quick healthy snack.', images: ['https://images.unsplash.com/photo-1596363505729-419b48e64cde?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Queen Pineapple (1 pc)', category: 'Exotic Fruits', price: 90, countInStock: 30, description: 'Aromatic and deeply sweet queen pineapple with minimal acidity.', images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Semi-Ripe Papaya (1 pc)', category: 'Fruits', price: 55, countInStock: 45, description: 'Organically grown papaya, excellent for digestion and extremely sweet.', images: ['https://images.unsplash.com/photo-1517282009859-f000ec3b26af?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Zespri Green Kiwi (3 pcs)', category: 'Exotic Fruits', price: 140, countInStock: 40, description: 'Tangy and incredibly healthy imported green kiwis loaded with nutrients.', images: ['https://images.unsplash.com/photo-1585059895524-72359e06138a?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Pink Dragon Fruit (1 pc)', category: 'Exotic Fruits', price: 150, countInStock: 25, description: 'Stunning pink dragon fruit with white flesh. High in antioxidants.', images: ['https://images.unsplash.com/photo-1527324410940-06b2db5df36f?w=600&q=80'], type: 'single', tags: ['Best Seller'] },
  { name: 'Hass Avocado (2 pcs)', category: 'Exotic Fruits', price: 290, countInStock: 15, description: 'Premium Hass Avocados, ripe and ready to be made into guacamole or toast.', images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Kabul Pomegranate (1kg)', category: 'Fruits', price: 240, countInStock: 35, description: 'Deep red, highly juicy pomegranates sourced from Kabul.', images: ['https://images.unsplash.com/photo-1615486511484-92e172a6b2ed?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Kiran Watermelon (Medium)', category: 'Seasonal Fruits', price: 85, countInStock: 50, description: 'Dark green kiran watermelon with extremely sweet, red flesh.', images: ['https://images.unsplash.com/photo-1587049352851-8d4e89134780?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Sweet Muskmelon (1 pc)', category: 'Seasonal Fruits', price: 70, countInStock: 40, description: 'Aromatic and hydrating muskmelon perfect for summer heat.', images: ['https://images.unsplash.com/photo-1598025362874-4c3111e3b692?w=600&q=80'], type: 'single', tags: [] },
  { name: 'Imported Blueberries (125g)', category: 'Exotic Fruits', price: 320, countInStock: 20, description: 'Fresh, tart and sweet blueberries imported raw and packed securely.', images: ['https://images.unsplash.com/photo-1498408040764-ab207ea3b482?w=600&q=80'], type: 'single', tags: ['Best Seller'] },
  { name: 'Red Cherries (250g)', category: 'Exotic Fruits', price: 280, countInStock: 15, description: 'Plump, glossy red cherries offering an explosion of sweet flavor.', images: ['https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600&q=80'], type: 'single', tags: [] }
];

const importData = async () => {
  try {
    await connectDB();
    
    // Wipe current database safely
    await Order.deleteMany();
    await Product.deleteMany();
    console.log('Previous data wiped clean.');

    // 1. Insert Base Single Fruits
    const createdFruits = await Product.insertMany(fruitsData);
    console.log(`${createdFruits.length} Single Fruits Imported.`);

    // Helper map to quickly find IDs by parsing product names
    const getFruitId = (partialName) => {
       const fruit = createdFruits.find(f => f.name.toLowerCase().includes(partialName.toLowerCase()));
       return fruit ? fruit._id : null;
    };

    // 2. Build Baskets referencing the newly generated Fruit IDs dynamically
    const basketsData = [
      {
        name: 'Basic Health Basket',
        category: 'Fruit Baskets',
        price: 399,
        countInStock: 10,
        description: 'An essential mix for everyday health, perfect for gifting or personal wellness.',
        images: ['https://images.unsplash.com/photo-1506807490089-a21239aa8073?w=600&q=80'],
        type: 'basket',
        tags: [],
        basketItems: [
          { product: getFruitId('Apple'), quantity: 2 },
          { product: getFruitId('Banana'), quantity: 1 },
          { product: getFruitId('Orange'), quantity: 1 }
        ]
      },
      {
        name: 'Exotic Premium Platter',
        category: 'Fruit Baskets',
        price: 899,
        countInStock: 8,
        description: 'A deeply premium basket containing strictly exotic and imported items. Perfect for corporate gifting.',
        images: ['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600&q=80'],
        type: 'basket',
        tags: ['Best Seller'],
        basketItems: [
          { product: getFruitId('Avocado'), quantity: 1 },
          { product: getFruitId('Kiwi'), quantity: 1 },
          { product: getFruitId('Dragon Fruit'), quantity: 1 },
          { product: getFruitId('Blueberries'), quantity: 1 }
        ]
      },
      {
        name: 'Festival Celebration Hammer',
        category: 'Fruit Baskets',
        price: 1299,
        countInStock: 5,
        description: 'A massive bundle for massive celebrations! Loaded with seasonal and premium fruit choices wrapped beautifully.',
        images: ['https://images.unsplash.com/photo-1592658852335-71cb7655074e?w=600&q=80'],
        type: 'basket',
        tags: ['Festival Special'],
        basketItems: [
          { product: getFruitId('Mango'), quantity: 1 },
          { product: getFruitId('Pomegranate'), quantity: 1 },
          { product: getFruitId('Apple'), quantity: 2 },
          { product: getFruitId('Pineapple'), quantity: 1 },
          { product: getFruitId('Cherries'), quantity: 1 }
        ]
      }
    ];

    // Safely insert the generated baskets exclusively
    const createdBaskets = await Product.insertMany(basketsData);
    console.log(`${createdBaskets.length} Predefined Baskets securely imported and nested!`);

    console.log('Seeding Execution Fully Passed ✓');
    process.exit();
  } catch (error) {
    console.error('Seeder Sequence Failed:', error.message);
    process.exit(1);
  }
};

importData();

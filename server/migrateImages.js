import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const products = await Product.find({});
    let updatedCount = 0;

    for (let p of products) {
      let needsUpdate = false;
      const oldImage = p.get('image'); // Access raw untyped data if schema changed
      // If there is an old strict image but the images array is critically empty or nonexistent
      if (oldImage && (!p.images || p.images.length === 0)) {
         p.images = [oldImage];
         needsUpdate = true;
      }
      
      if (needsUpdate) {
         await p.save();
         updatedCount++;
      }
    }
    
    // Globally unset the legacy 'image' field completely from all documents
    const result = await Product.updateMany({}, { $unset: { image: 1 } }, { strict: false });
    
    console.log(`Migration Complete: Migrated ${updatedCount} legacy products.`);
    console.log(`Field Eradication: Wiped legacy 'image' from ${result.modifiedCount} documents.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration Failed:', error);
    process.exit(1);
  }
};

migrate();

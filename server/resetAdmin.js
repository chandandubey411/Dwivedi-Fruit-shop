/**
 * Run with: node resetAdmin.js
 * Resets the admin email + password directly in MongoDB.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();
await connectDB();

// ─── SET YOUR DESIRED CREDENTIALS HERE ───────────────────────────────────────
const NEW_EMAIL    = 'admin@diwedi.com';
const NEW_PASSWORD = 'ADlach9910@';
// ─────────────────────────────────────────────────────────────────────────────

try {
  // Delete all existing admin records and create fresh
  await Admin.deleteMany({});
  const admin = await Admin.create({ email: NEW_EMAIL, password: NEW_PASSWORD });
  console.log('✅ Admin reset successfully!');
  console.log('   Email   :', admin.email);
  console.log('   Password: (hashed — use the plaintext you set above to login)');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  mongoose.connection.close();
  process.exit();
}

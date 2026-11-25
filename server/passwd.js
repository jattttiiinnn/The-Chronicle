import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from './db.js';
import { User } from './models.js';

/**
 * Reset the password for an existing account.
 *
 *   npm run passwd -- you@example.com "my new password"
 */
async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Usage: npm run passwd -- <email> "<new password>"');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
  }

  await connectDb();

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) {
    console.error(`No account found for ${email}.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  user.passwordHash = await bcrypt.hash(password, 10);
  await user.save();

  console.log(`Password updated for ${user.email}. Existing tokens stay valid until they expire.`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('Password reset failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

import mongoose from 'mongoose';
import { connectDb } from './db.js';
import { User } from './models.js';

const ROLES = ['reader', 'author', 'admin'];

/**
 * Promote (or re-role) an existing account from the terminal.
 *
 *   npm run promote -- you@example.com
 *   npm run promote -- you@example.com author
 */
async function main() {
  const [email, role = 'admin'] = process.argv.slice(2);

  if (!email) {
    console.error('Usage: npm run promote -- <email> [reader|author|admin]');
    process.exit(1);
  }
  if (!ROLES.includes(role)) {
    console.error(`Unknown role "${role}". Use one of: ${ROLES.join(', ')}`);
    process.exit(1);
  }

  await connectDb();

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) {
    console.error(`No account found for ${email}. Register in the app first, then run this again.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const previous = user.role;
  user.role = role;
  await user.save();

  console.log(`${user.email}: ${previous} → ${role}`);
  console.log(`Signed-in sessions pick up the new role on their next request.`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('Role update failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

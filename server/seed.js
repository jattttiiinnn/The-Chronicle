import fs from 'fs';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import { connectDb } from './db.js';
import { Comment, Post, User } from './models.js';
import { mockPosts, mockComments, mockUsers } from '../src/mocks/data.js';

if (fs.existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // ignore malformed env file
  }
}

const SEED_PASSWORD = process.env.SEED_PASSWORD || 'password123';

function postSortDate(post) {
  return new Date(post.publishedAt || post.publishAt || new Date().toISOString());
}

/**
 * Migrates the frontend mock stories into MongoDB, preserving the original ids so
 * authorId / likes / comment references stay valid. Safe to re-run (upserts).
 */
export async function seedDatabase({ fresh = false, password = SEED_PASSWORD, quiet = false } = {}) {
  const log = quiet ? () => {} : (...args) => console.log(...args);
  await connectDb();
  log(`Connected to ${mongoose.connection.name}`);

  if (fresh) {
    await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);
    log('Cleared existing users, posts and comments.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.bulkWrite(
    mockUsers.map((user) => ({
      replaceOne: {
        filter: { _id: user.id },
        replacement: {
          _id: user.id,
          name: user.name,
          email: user.email.toLowerCase(),
          passwordHash,
          role: user.role,
          bio: user.bio || '',
          avatarUrl: user.avatarUrl || '',
          bookmarks: [],
          createdAt: new Date('2026-10-01T09:00:00.000Z'),
          updatedAt: new Date('2026-10-01T09:00:00.000Z'),
        },
        upsert: true,
      },
    })),
    { timestamps: false }
  );
  log(`Seeded ${mockUsers.length} users (password: ${password}).`);

  await Post.bulkWrite(
    mockPosts.map((post) => ({
      replaceOne: {
        filter: { _id: post.id },
        replacement: {
          _id: post.id,
          authorId: post.authorId,
          title: post.title,
          slug: post.slug,
          content: post.content || '',
          excerpt: post.excerpt || '',
          coverUrl: post.coverUrl || '',
          categories: post.categories || [],
          tags: post.tags || [],
          status: post.status || 'draft',
          publishAt: post.publishAt ? new Date(post.publishAt) : null,
          featured: Boolean(post.featured),
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
          sortDate: postSortDate(post),
          views: post.views || 0,
          likes: post.likes || [],
          createdAt: postSortDate(post),
          updatedAt: postSortDate(post),
        },
        upsert: true,
      },
    })),
    { timestamps: false }
  );
  log(`Seeded ${mockPosts.length} posts.`);

  await Comment.bulkWrite(
    mockComments.map((comment) => ({
      replaceOne: {
        filter: { _id: comment.id },
        replacement: {
          _id: comment.id,
          postId: comment.postId,
          userId: comment.userId,
          parentId: comment.parentId || null,
          body: comment.body,
          isApproved: Boolean(comment.isApproved),
          isDeleted: Boolean(comment.isDeleted),
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
          updatedAt: comment.createdAt ? new Date(comment.createdAt) : new Date(),
        },
        upsert: true,
      },
    })),
    { timestamps: false }
  );
  log(`Seeded ${mockComments.length} comments.`);

  const admin = mockUsers.find((user) => user.role === 'admin');
  if (admin) log(`\nAdmin login: ${admin.email} / ${password}`);

  return { users: mockUsers.length, posts: mockPosts.length, comments: mockComments.length };
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  seedDatabase({ fresh: process.argv.includes('--fresh') })
    .then(() => mongoose.disconnect())
    .catch(async (error) => {
      console.error('Seed failed:', error.message);
      await mongoose.disconnect().catch(() => {});
      process.exit(1);
    });
}

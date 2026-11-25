import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const { Schema, model, models } = mongoose;

const baseOptions = {
  versionKey: false,
  timestamps: true,
};

const userSchema = new Schema(
  {
    _id: { type: String, default: () => `usr_${randomUUID().replace(/-/g, '').slice(0, 16)}` },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['reader', 'author', 'admin'], default: 'reader', index: true },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bookmarks: { type: [String], default: [] },
  },
  baseOptions
);

const postSchema = new Schema(
  {
    _id: { type: String, default: () => `post_${randomUUID().replace(/-/g, '').slice(0, 16)}` },
    authorId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft', index: true },
    publishAt: { type: Date, default: null },
    featured: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    // Denormalised coalesced date used for stable sorting (publishedAt || publishAt || createdAt).
    sortDate: { type: Date, default: () => new Date(), index: true },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] },
  },
  baseOptions
);

const commentSchema = new Schema(
  {
    _id: { type: String, default: () => `cmt_${randomUUID().replace(/-/g, '').slice(0, 16)}` },
    postId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    parentId: { type: String, default: null },
    body: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  baseOptions
);

// Binary image store so uploads work on serverless hosting without a third-party bucket.
const uploadSchema = new Schema(
  {
    _id: { type: String, default: () => `img_${randomUUID().replace(/-/g, '').slice(0, 16)}` },
    ownerId: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  baseOptions
);

export const User = models.User || model('User', userSchema);
export const Post = models.Post || model('Post', postSchema);
export const Comment = models.Comment || model('Comment', commentSchema);
export const Upload = models.Upload || model('Upload', uploadSchema);

// Strip Mongo internals and secrets, expose `_id` as `id` to match the frontend contract.
export function serialize(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  delete obj.__v;
  delete obj.passwordHash;
  if (obj._id !== undefined) {
    obj.id = String(obj._id);
    delete obj._id;
  }
  return obj;
}

export function serializeMany(docs) {
  return (docs || []).map(serialize);
}

// Never expose comment bodies or author records beyond what the UI reads.
export function serializeUser(user) {
  const obj = serialize(user);
  if (!obj) return null;
  delete obj.bookmarks;
  return obj;
}

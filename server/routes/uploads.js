import { Router } from 'express';
import multer from 'multer';
import { Upload } from '../models.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError, asyncHandler } from '../lib/helpers.js';

const router = Router();

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
});

function absoluteUrl(req, pathname) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}${pathname}`;
}

// POST /api/uploads/image (multipart/form-data, field name "image")
router.post(
  '/image',
  requireAuth,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) throw new HttpError(400, 'No image file received.');

    const name = (file.originalname || '').toLowerCase();
    const type = (file.mimetype || '').toLowerCase();

    // SVG can carry script, so it is refused outright.
    if (name.endsWith('.svg') || type.includes('svg')) {
      throw new HttpError(400, 'Invalid file type. SVG and non-images are strictly prohibited.');
    }
    if (!ALLOWED_TYPES.includes(type)) {
      throw new HttpError(400, 'Invalid image format. Allowed formats: JPEG, PNG, WebP.');
    }
    if (file.size > MAX_BYTES) {
      throw new HttpError(400, 'File size exceeds the 5MB maximum limit.');
    }

    const stored = await Upload.create({
      ownerId: String(req.user._id),
      contentType: type === 'image/jpg' ? 'image/jpeg' : type,
      size: file.size,
      data: file.buffer,
    });

    const url = absoluteUrl(req, `/api/uploads/${stored._id}`);
    return res.status(201).json({ secure_url: url, url, public_id: String(stored._id) });
  })
);

// GET /api/uploads/:id — public read of a stored image.
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const image = await Upload.findById(req.params.id);
    if (!image) throw new HttpError(404, 'Image not found');

    res.set('Content-Type', image.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(image.data);
  })
);

export default router;

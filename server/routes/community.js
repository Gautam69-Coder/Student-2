import express from 'express';
import auth from '../middleware/auth.js';
import CommunityPost from '../models/CommunityPost.js';

const router = express.Router();

// @route   GET api/community
// @desc    Get recent community posts (paginated)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            CommunityPost.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            CommunityPost.countDocuments(),
        ]);

        res.json({
            posts,
            page,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/community
// @desc    Create a new community post
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, username } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ msg: 'Content is required' });
        }


        const post = new CommunityPost({
            userId: req.user.id,
            username: username,
            title: title?.trim() || undefined,
            content: content.trim(),
        });

        await post.save();

        res.status(201).json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/community/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const userId = req.user.id.toString();
        const index = post.likedBy.findIndex((id) => id.toString() === userId);

        if (index > -1) {
            post.likedBy.splice(index, 1);
        } else {
            post.likedBy.push(userId);
        }

        await post.save();

        res.json({
            id: post.id,
            likedBy: post.likedBy,
            likesCount: post.likedBy.length,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;


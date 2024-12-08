const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('aravind', 'root', '@Aravind2001', {
    host: 'localhost',
    dialect: 'mysql'
});

const Post = sequelize.define('Post', {
    imageUrl: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { timestamps: true });

const Comment = sequelize.define('Comment', {
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { timestamps: true });

Post.hasMany(Comment, { onDelete: 'CASCADE' });
Comment.belongsTo(Post);

// Sync the models
sequelize.sync({ alter: true })
    .then(() => console.log('Database synchronized!'))
    .catch(err => console.error('Error synchronizing database:', err));

// Create a new post
app.post('/api/posts', async (req, res) => {
    const { imageUrl, description } = req.body;
    if (!imageUrl || !description) {
        return res.status(400).json({ error: 'Image URL and description are required.' });
    }

    try {
        const post = await Post.create({ imageUrl, description });
        res.status(201).json({ message: 'Post created successfully!', post });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Failed to create post.' });
    }
});

// Fetch all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
});

// Add a comment to a specific post
app.post('/api/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Comment text is required.' });
    }

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const comment = await Comment.create({ text, PostId: postId });
        res.status(201).json({ message: 'Comment added successfully!', comment });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
});

// Get comments for a specific post
app.get('/api/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.findAll({ where: { PostId: postId } });
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Failed to fetch comments.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

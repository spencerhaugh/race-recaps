const express = require('express');
const { route } = require('.');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

const Story = require('../models/Story');


// ROUTES

// ****************
// Show ADD page
// GET '/stories/add' 
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
});

// *****************
// Show single story
// GET '/stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById({ _id: req.params.id })
        .populate('user')
        .lean()

        if (!story) return res.render('error/404');

        res.render('stories/show', { story })
    } catch(err) {
        console.error(err);
        res.render('error/404');
    }
})

// ****************
// Process ADD Form
// POST '/stories'
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch(err) {
        console.error(err);
        res.render('error/500');
    }
});

// ****************
// Show ALL stories
// GET '/stories'
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();

        res.render('stories/index', { stories });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// ****************
// Show EDIT page
// GET '/stories/edit/:id'
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();

        // prevent unfound story, prevent incorrect user, else return edit page
        if (!story) return res.render('error/404');
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', { story })
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});

// ****************
// Process EDIT Form
// PUT '/stories/:id'
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById({ _id: req.params.id }).lean()

        // prevent unfound story, prevent incorrect user, else process update
        if (!story) return res.render('error/404');
        if (story.user != req.user.id) {
            res.redirect('/stories');
        } else {
            story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
            res.redirect('/dashboard');
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});

// ****************
// Delete Story
// DELETE '/stories/:id' 
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.findByIdAndDelete({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch(err) {
        console.error(err);
        return res.render('error/500');
    }
});

// Show User
// GET '/stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.params.userId, status: 'public' })
        .populate('user')
        .lean()

        res.render('stories/user', { stories })
    } catch (err) {
        console.error(err);
        res.send('error/500')
    }
});


module.exports = router;
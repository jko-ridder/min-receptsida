    const express = require('express');
    const router = express.Router();
    const Recipe = require('../schemas/recipeSchema.js');
    const User = require('../schemas/userSchema.js');
    const authenticateToken = require('../middleware/authenticateToken.js');

    const fetchSavedRecipes = async (req, res) => {
        try {
        const userId = req.user.userId;
    
        const user = await User.findById(userId).populate('favorites');
    
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        const recipeIds = user.favorites.map(favorite => favorite._id);
    
        const savedRecipes = await Recipe.find({ _id: { $in: recipeIds } });
    
        const missingRecipeIds = recipeIds.filter(id => !savedRecipes.some(recipe => recipe._id.equals(id)));
    
        if (missingRecipeIds.length > 0) {
            console.warn(`Some saved recipes were not found: ${missingRecipeIds.join(', ')}`);
        }
    
        res.json(savedRecipes);
        } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    };

    router.get('/saved-recipes', authenticateToken, fetchSavedRecipes);


    router.get('/', async (req, res) => {
        try {
            const recipes = await Recipe.aggregate([
                {
                    $lookup: {
                        from: 'users', 
                        localField: 'creator', 
                        foreignField: '_id', 
                        as: 'creatorInfo' 
                    }
                },
                {
                    $unwind: '$creatorInfo' 
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        ingredients: 1,
                        instructions: 1,
                        createdAt: 1,
                        image: 1,
                        likes: 1,
                        'creatorInfo.username': 1 
                    }
                }
            ]);

            res.json(recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });


    router.post('/add', authenticateToken, async (req, res) => {
        try {
            console.log('User:', req.user); 
            const { title, description, ingredients, instructions, image } = req.body;
            
            const userId = req.user.userId;

            console.log('userId:', userId);
            
            const imageUrl = image ? image : 'https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/lightchickenstock_90221_16x9.jpg';

            const newRecipe = new Recipe({
                title,
                description,
                ingredients,
                instructions,
                creator: userId,
                image: imageUrl 
            });
            await newRecipe.save();
            res.status(201).json ({ message: 'Recipe created succesfully!' });
        } catch (error) {
            console.error('Error creating recipe: ', error);
            res.status(500).json ({ message: 'Internal server error' });
        }
    });


    router.get('/user/:userId', async (req, res) => {
        try {
            const userId = req.params.userId; 
            const recipes = await Recipe.find({ creator: userId });
            res.json(recipes);
        } catch (error) {
            console.error('Error fetching user recipes:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.put('/:recipeId', authenticateToken, async (req, res) => {
        try {
            const { title, description, ingredients, instructions, image } = req.body;
            const recipeId = req.params.recipeId;
            
            const existingRecipe = await Recipe.findById(recipeId);
            if (!existingRecipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            
            if (existingRecipe.creator.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'You are not authorized to edit this recipe' });
            }

            existingRecipe.title = title;
            existingRecipe.description = description;
            existingRecipe.ingredients = ingredients;
            existingRecipe.instructions = instructions;
            existingRecipe.image = image;

            await existingRecipe.save();
            res.json({ message: 'Recipe updated successfully' });
        } catch (error) {
            console.error('Error updating recipe:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.post('/:id/like', authenticateToken, async (req, res) => {
        try {
            const userId = req.user.userId;
            const recipeId = req.params.id;
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const recipe = await Recipe.findById(recipeId);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
    
            if (recipe.creator.toString() === userId) {
                return res.status(403).json({ message: 'You cannot like your own recipe' });
            }
    
            const isAlreadyLiked = recipe.likes.includes(userId);
            if (isAlreadyLiked) {
                const index = recipe.likes.indexOf(userId);
                recipe.likes.splice(index, 1);
    
                const favIndex = user.favorites.indexOf(recipeId);
                if (favIndex !== -1) {
                    user.favorites.splice(favIndex, 1);
                }
            } else {
                recipe.likes.push(userId);
    
                user.favorites.push(recipeId);
            }
    
            await Promise.all([recipe.save(), user.save()]);
    
            res.status(200).json({ message: 'Recipe like status updated successfully' });
        } catch (error) {
            console.error('Error updating like status for recipe:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    

    router.get('/:recipeId', async (req, res) => {
        try {
            const recipeId = req.params.recipeId;
            
            const recipe = await Recipe.findById(recipeId).populate('creator', 'username');
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            res.json(recipe);
        } catch (error) {
            console.error('Error fetching recipe:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });


    router.delete('/:recipeId', authenticateToken, async (req, res) => {
        try {
            const recipeId = req.params.recipeId;

            const recipe = await Recipe.findById(recipeId);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            if (recipe.creator.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
            }

            await Recipe.deleteOne({ _id: recipeId });
            res.json({ message: 'Recipe deleted successfully' });
        } catch (error) {
            console.error('Error deleting recipe:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

router.post('/:recipeId/comments', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body; 

        const recipeId = req.params.recipeId;
        const userId = req.user.userId; 
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

       
        const newComment = {
            user: userId, 
            text: text
        };

        recipe.comments.push(newComment);

        await recipe.save();

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/:recipeId/comments', async (req, res) => {
    try {
        const recipeId = req.params.recipeId;

        const recipe = await Recipe.findById(recipeId).populate('comments.user', 'username');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe.comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


    module.exports = router;
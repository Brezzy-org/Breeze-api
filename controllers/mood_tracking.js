import { MoodModel } from "../models/mood_tracking.js";
import { addMoodValidator, updateMoodValidator } from "../validators/mood_tracking.js";

// Controller for adding a mood (users can only add their own)
export const addMood = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = addMoodValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        // Attach authenticated user's ID
        const moodData = { ...value, userId: req.auth.id };

        // Write mood to the database
        await MoodModel.create(moodData);

        res.status(201).json("Mood has been created!");
    } catch (error) {
        next(error);
    }
};

// Controller for fetching all moods
export const getMoods = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit = 10, skip = 0 } = req.query;
        const query = req.auth.role === 'therapist'
            ? JSON.parse(filter)  // Therapist can view all moods
            : { ...JSON.parse(filter), userId: req.auth.id }; // User can only view their own

        const moods = await MoodModel.find(query)
            .sort(JSON.parse(sort))
            .limit(limit)
            .skip(skip);

        res.status(200).json(moods);
    } catch (error) {
        next(error);
    }
};

// Controller for fetching a specific mood by ID
export const getMood = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mood = await MoodModel.findById(id);

        // Check ownership if role is 'user'
        if (req.auth.role === 'user' && mood.userId.toString() !== req.auth.id) {
            return res.status(403).json("Not authorized to view this mood.");
        }

        res.status(200).json(mood);
    } catch (error) {
        next(error);
    }
};

// Controller for updating a mood (only by the user who created it)
export const updateMood = async (req, res, next) => {
    try {
        const { error, value } = updateMoodValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        const mood = await MoodModel.findById(req.params.id);

        // Only allow updates if the user owns the mood
        if (mood.userId.toString() !== req.auth.id) {
            return res.status(403).json("Not authorized to update this mood.");
        }

        const updatedMood = await MoodModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!updatedMood) {
            return res.status(404).json({ message: "Mood not found" });
        }

        res.status(200).json(updatedMood);
    } catch (error) {
        next(error);
    }
};

// Controller for deleting a mood (only by the user who created it)
export const deleteMood = async (req, res, next) => {
    try {
        // Find the mood by ID
        const mood = await MoodModel.findById(req.params.id);

        // Check if mood exists
        if (!mood) {
            return res.status(404).json({ message: "Mood not found" });
        }

        // Only allow deletion if the user owns the mood
        if (mood.userId.toString() !== req.auth.id) {
            return res.status(403).json("Not authorized to delete this mood.");
        }

        // Delete the mood
        await MoodModel.findByIdAndDelete(req.params.id);

        // Send success response
        res.status(200).json({ message: "Mood successfully deleted!" });
    } catch (error) {
        next(error);
    }
};


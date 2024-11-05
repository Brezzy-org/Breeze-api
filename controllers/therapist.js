import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginTherapistValidator, registerTherapistValidator, updateTherapistProfileValidator } from "../validators/therapist.js";
import { TherapistModel } from "../models/therapist.js";

export const registerTherapist = async (req, res, next) => {
    try {
        // validate the user
        const { error, value } = registerTherapistValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error)
        }
        // check if user already exists
        const therapist = await TherapistModel.findOne({ email: value.email });
        if (therapist) {
            return res.status(409).json('user already exists!');
        }
        // encrypt the password by hashing
        const hashedPassword = bcrypt.hashSync(value.password, 12);
        // Save the user into the database
        await TherapistModel.create({
            ...value,
            password: hashedPassword
        });
        // send user confirmation email
        // return response
        res.status(201).json("Therapist registered successfully")
    } catch (error) {
        next(error);
    }
};

// Login Therapist
export const loginTherapist = async (req, res, next) => {
    try {
        // Validate therapist login request
        const { error, value } = loginTherapistValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error.details[0].message);
        }

        // Check if therapist exists in the database
        const therapist = await TherapistModel.findOne({ email: value.email });
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist does not exist!' });
        }

        // Validate password
        const correctPassword = bcrypt.compareSync(value.password, therapist.password);
        if (!correctPassword) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        // Generate token
        const token = jwt.sign(
            { id: therapist._id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '24h' }
        );

        // Return response
        res.status(200).json({
            message: 'Therapist logged in successfully',
            accessToken: token
        });
    } catch (error) {
        next(error);
    }
};

// Get Therapist Profile
export const getTherapistProfile = async (req, res, next) => {
    try {
        // Find authenticated therapist from the database
        const therapist = await TherapistModel
            .findById(req.auth.id)
            .select({ password: false });
        
        // Check if therapist exists
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist not found' });
        }

        // Return response
        res.json(therapist);
    } catch (error) {
        next(error);
    }
};


export const updateTherapistProfile = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = updateTherapistProfileValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error)
        }
        // check if user exists
        const updatedTherapist = await TherapistModel.findByIdAndUpdate(req.auth.id, value, { new: true });
        if (!updatedTherapist) {
            return res.status(404).json('User not found');
        }
        // return response
        res.json('Therapist profile updated')
    } catch (error) {
        next(error);
    }
}

export const logoutTherapist = (req, res, next) => {
    res.json('Therapist logged out')
}


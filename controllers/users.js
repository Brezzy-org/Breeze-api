import { UserModel } from "../models/users.js";
import { loginUserValidator, registerUserValidator, updateProfileValidator } from "../validators/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
    try {
        // validate the user
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error)
        }
        // check if user already exists
        const user = await UserModel.findOne({ email: value.email });
        if (user) {
            return res.status(409).json('user already exists!');
        }
        // encrypt the password by hashing
        const hashedPassword = bcrypt.hashSync(value.password, 12);
        // Save the user into the database
        await UserModel.create({
            ...value,
            password: hashedPassword
        });
        // send user confirmation email
        // return response
        res.status(201).json("User registered successfully")
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        // validate the user logging in
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // check if user exists in the database
        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json('user does not exist!');
        }
        // check if user logged in with the correct password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid credentials!');
        }
        // Give logged in user a token
        const token = jwt.sign(
            { id: user.id, role: 'user' },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '24h' }
        )
        // return response
        res.status(200).json({
            message: 'User logged in successfully',
            accessToken: token
        });
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        // Find authenticated user from the database
        const user = await UserModel
            .findById(req.auth.id)
            .select({
                password: false
            });
        // check if user exists
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        // return response
        res.json(user)
    } catch (error) {
        next(error);
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        // Validate user input
        const { error, value } = updateProfileValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error)
        }
        // check if user exists
        const updatedUser = await UserModel.findByIdAndUpdate(req.auth.id, value, { new: true });
        if (!updatedUser) {
            return res.status(404).json('User not found');
        }
        // return response
        res.json('User profile updated')
    } catch (error) {
        next(error);
    }
}

export const logoutUser = (req, res, next) => {
    res.json('user logged out')
}


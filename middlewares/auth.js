import { expressjwt } from "express-jwt";
import { permissions } from "../utils/rbac.js";
import { UserModel } from "../models/users.js";
import { TherapistModel } from "../models/therapist.js";

export const isAuthenticated = expressjwt({
    secret: process.env.JWT_PRIVATE_KEY,
    algorithms: ['HS256']
});


export const hasPermission = (action) => {
    return async (req, res, next) => {
        try {
            // Determine which model to use based on route or role
            const model = req.route.path.includes('/therapist') ? TherapistModel : UserModel;

            // Find the user or therapist
            const person = await model.findById(req.auth.id);

            // Find permissions based on the role
            const permission = permissions.find(value => value.role === person.role);
            if (!permission) {
                return res.status(403).json('No permission found!');
            }

            // Check if the action is permitted
            if (permission.actions.includes(action)) {
                next();
            } else {
                res.status(403).json('Action not allowed');
            }
        } catch (error) {
            next(error);
        }
    }
}

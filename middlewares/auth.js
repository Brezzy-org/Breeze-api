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
            // Ensure req.auth and req.auth.id are available
            if (!req.auth || !req.auth.id) {
                return res.status(401).json({ error: "Unauthorized. Authentication required." });
            }
            

            // Determine model based on route
            // const model = req.route.path.includes('/therapist') ? TherapistModel : UserModel;
            // const person = await model.findById(req.auth.id);

            // if (!person) {
            //     return res.status(404).json({ error: "User not found" });
            // }

            // Debug role found in the database
          

            // Fetch permissions for role
            const permission = permissions.find(value => value.role === req.auth.role);
            if (!permission) {
                return res.status(403).json('No permission found!');
            }

            // Check action permission
            if (permission.actions.includes(action)) {
                next();
            } else {
                res.status(403).json('Action not allowed');
            }
        } catch (error) {
            next(error);
        }
    };
};



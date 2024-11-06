import { Router } from "express";
import { getTherapistProfile, loginTherapist, logoutTherapist, registerTherapist, updateTherapistProfile } from "../controllers/therapist.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";



// create router
const therapistRouter = Router();

// define routes
therapistRouter.post("/therapist/register", registerTherapist);

therapistRouter.post("/therapist/login", loginTherapist);

therapistRouter.get("/therapist/me", isAuthenticated, hasPermission('get_therapist_profile'), getTherapistProfile);

therapistRouter.patch("/therapist/me/:id", isAuthenticated, hasPermission('update_therapist_profile'), updateTherapistProfile);

therapistRouter.post("/therapist/logout", logoutTherapist);

// export router
export default therapistRouter
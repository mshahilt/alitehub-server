import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { UserRepositoryImpl } from "../repositories/UserRepository";

dotenv.config();
const userRepository = new UserRepositoryImpl();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userData = {
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                    avatar: profile.photos?.[0].value
                };

                let user = null;
                if (userData.email) {
                    user = await userRepository.findByEmail(userData.email);
                }

                if (!user) {
                    user = await userRepository.create({
                        id: userData.googleId,
                        name: userData.name,
                        email: userData.email || "",
                        username: userData.name.replace(/\s/g, "").toLowerCase()
                    });
                }

                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id:string, done) => {
    const user = await userRepository.findById(id);
    done(null, user);
});

export default passport;

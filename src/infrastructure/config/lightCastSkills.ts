import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getAccessTokenForSkills = async () => {
    try {
        const data = new URLSearchParams();
        data.append("client_id", process.env.LIGHTCAST_CLIENT_ID || "");
        data.append("client_secret", process.env.LIGHTCAST_CLIENT_SECRET || "");
        data.append("grant_type", "client_credentials");
        data.append("scope", "emsi_open");

        const response = await axios.post("https://auth.emsicloud.com/connect/token", data.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        console.log("Access token:", response.data.access_token);
        return response.data.access_token;
    } catch (error: any) {
        console.error("Error fetching access token:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with Lightcast API.");
    }
};

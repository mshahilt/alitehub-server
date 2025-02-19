import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_GEMINI_API_KEY: string =  process.env.GOOGLE_GEMINI_API_KEY as string;

export class GenerateQuizAiService {
    static async generateQuestion(jobDiscription: string, jobResponsibilty: string, yearOfExperience: string): Promise<String> {
        try {
            const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

            const prompt = `Analyze the job description: "${jobDiscription}" and determine the most relevant job role (e.g., MERN Stack Developer, Backend Developer, Frontend Developer, etc.).  
                            Based on the identified role, generate exactly 5 highly technical interview questions covering key technologies and concepts related to that role.  

                            Each question should be formatted as follows to make extraction easier:  

                            **Output format:**  
                            Question 1: [Insert question here]  
                            Question 2: [Insert question here]  
                            Question 3: [Insert question here]  
                            Question 4: [Insert question here]  
                            Question 5: [Insert question here]  

                            Ensure that questions scale in difficulty based on ${yearOfExperience} years of experience.  
                            The questions should be practical, industry-relevant, and focused on assessing in-depth knowledge.  
                            Do not provide answers—only the questions in the specified format. if the role is not related to software development like HR, Communication trainers. built some soft skill question for them`;


            const result = await model.generateContent(prompt);
            const question = result.response.text();
            console.log(question);
            return question;
        } catch (error) {
            console.error("Error generating questions:", error);
            throw new Error("Failed to generate questions");
        }
    }
}
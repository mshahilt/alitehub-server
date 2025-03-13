import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_GEMINI_API_KEY: string = process.env.GOOGLE_GEMINI_API_KEY as string;

export class GenerateQuizAiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        this.genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async generateQuestion(jobDescription: string, jobResponsibility: string, yearOfExperience: string): Promise<string> {
        try {
            const prompt = `Analyze the job description: "${jobDescription}" and determine the most relevant job role (e.g., MERN Stack Developer, Backend Developer, Frontend Developer, etc.).
                            Based on the identified role, generate exactly 5 highly technical interview questions covering key technologies and concepts related to that role, questions needs to be answered in few words(max: 5).

                            Each question should be formatted as follows to make extraction easier:

                            **Output format:**  
                            Question 1: [Insert question here]  
                            Question 2: [Insert question here]  
                            Question 3: [Insert question here]  
                            Question 4: [Insert question here]  
                            Question 5: [Insert question here]  

                            Ensure that questions scale in difficulty based on ${yearOfExperience} years of experience.
                            The questions should be practical, industry-relevant, and focused on assessing in-depth knowledge.
                            Do not provide answers—only the questions in the specified format. If the role is not related to software development like HR or Communication trainers, build some soft skill questions for them.`;

            const result = await this.model.generateContent(prompt);
            const question = result.response.text();
            return question;
        } catch (error) {
            console.error("Error generating questions:", error);
            throw new Error("Failed to generate questions");
        }
    }

    async evaluateQuestionAndAnswer(questionAnswerPairs: { question: string; answer: string }[]): Promise<string> {
        try {
            const prompt = `You are an AI that evaluates technical interview responses.  
                            Given the following question and answer pairs, assess each answer for correctness, depth, and relevance.  
                            Provide feedback and a score (out of 100) for each answer.

                            **Example Output Format:**  
                            Score: [X/100]  
                            
                            as an output i just need the score like the example i don't need any further details like feedback. and also make total score don't need score foreach questions
                            **Here are the question-answer pairs:**  
                            ${questionAnswerPairs
                                .map((qa, index) => `Question ${index + 1}: ${qa.question} \nAnswer: ${qa.answer}`)
                                .join("\n\n")}`;

            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("Error evaluating answers:", error);
            throw new Error("Failed to evaluate answers");
        }
    }
}

import transporter from "../config/nodemailerConfig";

export class EmailService {
    static async sendOtp(email: string, otp: string): Promise<void> {
        try {
            const mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: "Your OTP Code - Secure Verification",
                html: this.generateOtpHtml(otp),
            };

            await transporter.sendMail(mailOptions);
            console.log(`OTP email sent to ${email}`);
        } catch (error) {
            console.error("Error sending OTP email:", error);
            throw new Error("Failed to send OTP email");
        }
    }

    private static generateOtpHtml(otp: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 500px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .logo {
                    width: 100px;
                    margin-bottom: 10px;
                }
                .header {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                .otp-code {
                    font-size: 32px;
                    font-weight: bold;
                    color: #007BFF;
                    margin: 20px 0;
                    letter-spacing: 5px;
                }
                .message {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 20px;
                }
                .cta-button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: white;
                    padding: 12px 20px;
                    font-size: 18px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 10px;
                }
                .footer {
                    font-size: 14px;
                    color: #999;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://knowquran.in/images/alitehubLogo.png" alt="Alite hub" class="logo">
                <div class="header">Your OTP Code</div>
                <div class="message">Use the OTP below to complete your verification. This code is valid for 10 minutes.</div>
                <div class="otp-code">${otp}</div>
                <a href="#" class="cta-button">Verify Now</a>
                <div class="footer">If you didn't request this code, please ignore this email.</div>
            </div>
        </body>
        </html>
        `;
    }
}

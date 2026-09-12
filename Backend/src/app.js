const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

// Trust reverse proxy in production (Render, Vercel, Railway, etc.)
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean).map(url => url.replace(/\/+$/, ""));

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server, Postman, mobile or no-origin requests
            if (!origin) return callback(null, true);

            const cleanOrigin = origin.replace(/\/+$/, "");
            if (
                allowedOrigins.includes(cleanOrigin) ||
                cleanOrigin.endsWith(".vercel.app") ||
                !process.env.FRONTEND_URL
            ) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

// Health check endpoint for hosting platforms (Render, Railway, Uptime monitors)
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Gen-AI Interview Assistant API is running smoothly",
        status: "ok",
        environment: process.env.NODE_ENV || "development"
    });
});

// require all routes here
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

// using all the routes here
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app
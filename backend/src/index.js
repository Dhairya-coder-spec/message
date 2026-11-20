// DNS
import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

/*----------------------------------------------------------------------------------------------------------------------------*/

import express from "express";
import cors from "cors";

import "dotenv/config";

import fs from "fs";
import path from "path";

import { clerkMiddleware } from '@clerk/express'

import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js"

// Express initialization
const app = express()

const publicDir = path.join(process.cwd(), "public");

app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook)

// Middlewares
app.use(express.json())
app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(clerkMiddleware())

app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
});

/* if public directory exists, serve the static files.
this is for production build */
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir))

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log("Server is up and running on PORT:", PORT)

    if (process.env.NODE_ENV === "production") job.start();
})
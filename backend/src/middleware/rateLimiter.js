import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => { 

    try {
        //in real app we can  user_id or ip address
        const { success } = await ratelimit.limit("my-rate-limit");
        if (!success) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        }

        next();
        
    } catch (error) {
        console.log("Rate limit error", error)
        next(error)
        
    }
}

export default rateLimiter;
// This middleware checks the rate limit for incoming requests.
// If the limit is exceeded, it responds with a 429 status code.
// If the request is within the limit, it calls the next middleware or route handler.
// This is useful for preventing abuse and ensuring fair usage of the API.
// The rate limit is defined in the Upstash configuration, which can be adjusted as needed.
// The middleware can be applied to specific routes or globally in the Express app.
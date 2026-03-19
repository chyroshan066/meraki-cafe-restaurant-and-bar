import emailjs from "@emailjs/browser";
import { SubscriptionFormData } from "@/middlewares/schema";

interface Subscription extends Record<string, unknown> {
    email: string;
}

interface SubscriptionEmail extends Subscription {
    timeStamp: string;
    type: string; 
}

export const onSubscriptionSubmit = async (data: SubscriptionFormData) => {
    // Ensure we use the base URL from your environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const response = await fetch(`https://api.merakirestro.com/api/subscribe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        // This will be caught by the try-catch block in your Footer component
        throw new Error(result.message || "Failed to subscribe");
    }

    return result;
};
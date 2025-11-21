import axios from "axios";

export const sendToOpenRouter = async (messages: any[]) => {
    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "google/gemma-3n-e4b-it:free",
            messages
        },
        {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "LanguageHub-AI-Chat"
            }
        }
    );

    return response.data.choices[0].message.content;
};

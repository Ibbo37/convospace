import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // User input le rahe hain

    const API_KEY = process.env.OPENROUTER_API_KEY; // 🔒 Secure API Key
    if (!API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Free & fast model
        messages: [{ role: "user", content: message }], // User message dynamic hai
        max_tokens: 200, // Tokens limit to optimize cost
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "API Error" }, { status: response.status });
    }

    const data = await response.json(); // JSON response parse kar rahe hain
    const botReply = data.choices?.[0]?.message?.content || "No response from AI.";

    return NextResponse.json({ reply: botReply }); // ✅ Send response back to frontend
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

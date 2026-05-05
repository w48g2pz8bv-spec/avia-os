 import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { industry, style, prompt } = await req.json();

    const systemPrompt = `You are AIVA (Artificial Intelligence Virtual Architect), a high-end web architect. 
    Your task is to generate premium website content in Turkish.
    Return ONLY a JSON object with the following structure:
    {
      "hero": "A powerful catchy title",
      "sub": "A sophisticated subtitle",
      "cta": "Call to action text",
      "services": ["Service 1", "Service 2", "Service 3"]
    }`;

    const userPrompt = `Generate website content for the following business:
    Industry: ${industry}
    Extra details/prompt: ${prompt || "High performance digital infrastructure"}
    Style: ${style || "Modern/Futuristic"}
    Language: Turkish`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content || "{}");

    return Response.json({ 
      ...content,
      status: "compiled",
      architecture: "v4.2.0-neural",
      model: "gpt-4o-mini"
    });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return Response.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
 import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { industry, style, prompt, context } = await req.json();

    // Organize knowledge base context into a readable string
    const knowledgeContext = context && context.length > 0 
      ? `\nKullanıcının Bilgi Bankasından Özel Bilgiler:\n${context.map((c: any) => `- ${c.content}`).join('\n')}`
      : "";

    const systemPrompt = `Sen AIVA (Artificial Intelligence Virtual Architect) isimli, lüks ve profesyonel bir web mimarısın. 
    Görevin, verilen işletme bilgileri ve 'Kurumsal Hafıza' (Bilgi Bankası) verilerini kullanarak %100 gerçekçi web sitesi içeriği üretmektir.
    
    ÖNEMLİ KURALLAR:
    1. Eğer 'Kurumsal Hafıza' içinde çalışma saatleri, özel hizmetler veya adres gibi bilgiler varsa bunları MUTLAKA içeriğe dahil et.
    2. Dil: Türkçe. Üslup: Profesyonel, güven verici ve modern.
    3. JSON formatında cevap ver.
    
    Return ONLY a JSON object:
    {
      "hero": "Etkileyici ana başlık",
      "sub": "Kurumsal hafızadaki detayları içeren profesyonel alt başlık",
      "cta": "Harekete geçirici mesaj",
      "services": ["Gerçekçi hizmet 1", "Gerçekçi hizmet 2", "Gerçekçi hizmet 3"],
      "imageKeyword": "Unsplash için İngilizce görsel arama kelimesi (Örn: 'modern dental clinic')"
    }`;

    const userPrompt = `İşletme Sektörü: ${industry}
    Ekstra Detaylar: ${prompt || "Yüksek performanslı dijital altyapı"}
    Stil: ${style || "Modern/Gelecekçi"}
    ${knowledgeContext}`;

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
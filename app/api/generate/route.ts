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
    Görevin, verilen işletme bilgileri ve 'Kurumsal Hafıza' (Bilgi Bankası) verilerini kullanarak %100 GERÇEKÇİ VE DERİNLEMESİNE bir web mimarisi oluşturmaktır.
    
    ÖNEMLİ KURALLAR:
    1. YÜZEYSEL OLMA. İşletmenin kimliğini (About), en çok sorulan soruları (FAQ) ve sunduğu hizmetlerin detaylarını Kurumsal Hafıza'ya dayanarak kurgula.
    2. Hafızadaki adres, telefon ve özel notları MUTLAKA ilgili bölümlere (Contact, Footer) yerleştir.
    3. Dil: Türkçe. Üslup: Premium ve ikna edici.
    
    Return ONLY a JSON object:
    {
      "hero": { "title": "...", "sub": "...", "cta": "..." },
      "about": { "title": "Hikayemiz", "content": "KB verilerine dayalı derin hikaye..." },
      "services": [
        { "name": "...", "desc": "Detaylı açıklama", "icon": "Lucide ikon ismi" }
      ],
      "faqs": [
        { "q": "...", "a": "..." }
      ],
      "testimonials": [
        { "name": "...", "text": "...", "rating": 5 }
      ],
      "contact": { "address": "...", "phone": "...", "email": "..." },
      "imageKeyword": "Unsplash English Keyword"
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
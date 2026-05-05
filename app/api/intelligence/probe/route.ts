import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { sector, context } = await req.json();

    if (!sector) {
      return NextResponse.json({ error: 'Sektör bilgisi gerekli' }, { status: 400 });
    }

    const systemPrompt = `Sen AIVA OS'in 'Intelligence HQ' (Market & Competitor Intelligence) motorusun. 
    Görevin, verilen sektöre göre otonom bir pazar analizi ve rakip matrisi oluşturmaktır.
    
    ANALİZ KURALLARI:
    1. ${sector} sektörü için 3 adet gerçekçi ama anonimleştirilmiş güçlü rakip kurgula.
    2. Her rakibin bir gücünü (Strength) ve bir zayıflığını (Weakness) belirle.
    3. AIVA'nın (bizim sistemimiz) bu rakibe karşı "Stratejik Avantajını" (AIVA Edge) açıkla. (Vapi hızı, Otomatik RAG, 7/24 Call handling vb. vurgula).
    4. Her rakip için 100 üzerinden bir Dominance Score üret.
    
    JSON FORMATINDA CEVAP VER:
    {
      "competitors": [
        { "name": "...", "strength": "...", "weakness": "...", "aivaEdge": "...", "score": 85, "risk": "Low/Medium/High" }
      ],
      "marketInsights": {
        "dominanceLevel": "ELITE/LEADER/CHALLENGER",
        "growthPotential": "+14.2%",
        "summary": "Pazarın genel durumu özeti..."
      }
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Sektör: ${sector}. Kullanıcı Bilgi Bankası Özeti: ${context || 'Genel Sektör Verisi'}` }
      ],
      response_format: { type: "json_object" }
    });

    const intelData = JSON.parse(response.choices[0].message.content || "{}");

    return NextResponse.json(intelData);

  } catch (error: any) {
    console.error('Intelligence API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

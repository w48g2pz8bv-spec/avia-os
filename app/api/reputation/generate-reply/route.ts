import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { reviewContent, authorName, rating, context } = await req.json();

    const systemPrompt = `Sen AIVA OS'in 'Reputation AI Replier' (İtibar Yönetimi) asistanısın. 
    Görevin, bir işletmeye gelen yorumlara profesyonel, nazik ve kurumsal kimliğe uygun yanıtlar üretmektir.
    
    YANIT KURALLARI:
    1. Kullanıcının Bilgi Bankası (Knowledge Base) verilerini MUTLAKA kullan (çalışma saatleri, özel hizmetler vb.).
    2. Eğer yorum negatifse, çözüm odaklı ol ve özür dilemek yerine telafi teklif et.
    3. Eğer yorum pozitifse, teşekkür et ve markaya olan bağlılığı artıracak bir cümle kur.
    4. Dil: Türkçe. Üslup: Premium ve Samimi.
    
    SADECE YANIT METNİNİ DÖN.`;

    const userPrompt = `
    Yazar: ${authorName}
    Puan: ${rating}/5
    Yorum: "${reviewContent}"
    
    Kurumsal Hafıza Notları:
    ${context || 'Genel profesyonel hizmet anlayışı.'}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Reputation API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

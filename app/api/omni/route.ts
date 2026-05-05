import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { command, context } = await req.json();

    if (!command) {
      return NextResponse.json({ error: 'Komut gerekli' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY eksik' }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Hızlı yanıt için mini model
      messages: [
        {
          role: "system",
          content: `Sen AIVA OS'in 'Omni-Command' (God Mode) terminalisin. Bir yapay zeka işletim sisteminin beynisin.
Aşağıda sistemin anlık gerçek metrikleri bulunuyor:
[SİSTEM DURUMU]
- Vapi (Sesli AI) Çağrı Sayısı: ${context.vapiCalls}
- Otomasyon Motoru Tetiklenme Sayısı: ${context.automationRuns}
- Neural Knowledge (Vektör) Hafıza Boyutu: ${context.memoryVectors}

Kullanıcı sana sistem yöneticisi olarak emirler verecek veya soru soracak.
CEVAP STİLİ:
- Kısa, otoriter, son derece teknolojik (Jarvis veya Cyberpunk tarzı).
- Gereksiz nezaket kullanma ("Tabii ki, hemen yapıyorum" yerine "EXECUTION INITIATED..." tarzı).
- Sistemin verilerini kullanarak rapor ver.`
        },
        {
          role: "user",
          content: command
        }
      ]
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });

  } catch (error: any) {
    console.error('Omni API Error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}

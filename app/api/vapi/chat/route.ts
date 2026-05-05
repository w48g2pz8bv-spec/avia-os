import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, context, agentName } = await req.json();

    const knowledgeContext = context && context.length > 0 
      ? `\nİŞLETME BİLGİ BANKASI (KURUMSAL HAFIZA):\n${context.map((c: any) => `- ${c.content}`).join('\n')}`
      : "\nBilgi bankası şu an boş.";

    const systemPrompt = `Sen ${agentName} isimli profesyonel bir yapay zeka sesli asistanısın. 
    AIVA OS ekosisteminin bir parçasısın.
    
    GÖREVİN:
    1. Sana verilen 'KURUMSAL HAFIZA' bilgilerini kullanarak müşterilere doğru cevaplar ver.
    2. Eğer hafızada bir bilgi yoksa, kibarca bilmediğini belirt ve randevu oluşturmayı teklif et.
    3. Dil: Türkçe. Üslup: Nazik, profesyonel ve insan odaklı.
    4. Cevapların kısa ve öz olsun (sesli asistan olduğun için uzun cümleler kurma).
    
    ${knowledgeContext}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    return Response.json({ 
      response: response.choices[0].message.content,
      status: "synced"
    });
  } catch (error: any) {
    console.error("Vapi Chat Error:", error);
    return Response.json({ error: "Neural connection lost" }, { status: 500 });
  }
}

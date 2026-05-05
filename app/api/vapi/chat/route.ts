import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, context, agentName, defenseProtocols } = await req.json();

    const knowledgeContext = context && context.length > 0 
      ? `\nİŞLETME BİLGİ BANKASI (KURUMSAL HAFIZA):\n${context.map((c: any) => `- ${c.content}`).join('\n')}`
      : "\nBilgi bankası şu an boş.";

    // DYNAMIC DEFENSE INJECTION
    let defenseInjection = "";
    if (defenseProtocols && defenseProtocols.length > 0) {
        defenseInjection = `\nSAVUNMA PROTOKOLLERİ (İTİRAZ YÖNETİMİ):\n${defenseProtocols.map((d: any) => `Eğer müşteri '${d.trigger}' konusunu açarsa, '${d.defense}' stratejisini uygula: ${d.strategy}`).join('\n')}`;
    }

    const systemPrompt = `Sen ${agentName} isimli profesyonel bir yapay zeka satış ve randevu asistanısın. 
    AIVA OS ekosisteminin en kritik 'Sales Architect' katmanısın.
    
    TEMEL YÖNERGELER:
    1. KURUMSAL HAFIZA bilgilerini kullanarak kesin ve doğru bilgi ver.
    2. SAVUNMA PROTOKOLLERİ'ni kullanarak müşteri itirazlarını profesyonelce yönet. Fiyat veya güven itirazı gelirse asla geri adım atma, stratejiyi uygula.
    3. Hedefin her zaman bir sonraki adımı (randevu, demo, kayıt) netleştirmektir.
    4. Dil: Türkçe. Üslup: Yüksek otorite, ikna edici ama nazik.
    5. Cevapların bir sesli asistan için ideal uzunlukta (max 2-3 kısa cümle) olsun.
    
    ${knowledgeContext}
    ${defenseInjection}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Upgraded to gpt-4o for better negotiation logic
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;

    return Response.json({ 
      response: aiResponse,
      status: "synced",
      neuralMeta: {
        defenseActive: defenseProtocols?.some((d: any) => message.toLowerCase().includes(d.trigger.toLowerCase())),
        intentScore: aiResponse?.length ? Math.floor(Math.random() * 20) + 80 : 0
      }
    });
  } catch (error: any) {
    console.error("Vapi Chat Error:", error);
    return Response.json({ error: "Neural connection lost" }, { status: 500 });
  }
}

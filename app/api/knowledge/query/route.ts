import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is missing' }, { status: 500 });
    }

    // 1. Kullanıcının sorusunu OpenAI Embeddings ile vektöre çevir (1536 boyut)
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    
    const [{ embedding }] = embeddingResponse.data;

    // 2. Supabase pgvector RPC fonksiyonunu (match_document_chunks) çağırarak en yakın/benzer verileri bul
    const { data: matchedChunks, error: matchError } = await supabase.rpc('match_document_chunks', {
      query_embedding: embedding,
      match_threshold: 0.5, // %50 ve üzeri benzerlik (Cosine Similarity)
      match_count: 5 // En iyi 5 parçayı getir
    });

    if (matchError) {
      throw new Error(`Semantik arama hatası: ${matchError.message}`);
    }

    // Eğer veritabanında hiç ilgili bilgi bulunamazsa:
    if (!matchedChunks || matchedChunks.length === 0) {
      return NextResponse.json({ 
          answer: "Üzgünüm, AIVA'nın hafızasında bu konuyla ilgili bir vektör kaydı bulunamadı.", 
          sources: [] 
      });
    }

    // 3. Bulunan parçaları birleştirerek (Context) LLM'e sun
    const contextText = matchedChunks.map((chunk: any) => chunk.content).join('\n\n---\n\n');

    // 4. OpenAI GPT-4o (veya gpt-4o-mini) modeline "Sadece bu context'e göre cevap ver" diyerek prompt yolla
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Hızlı ve ucuz, RAG için ideal
      messages: [
        {
          role: "system",
          content: "Sen AIVA OS'in içindeki 'Semantic Oracle' adlı yapay zeka çekirdeğisin. Sana verilen bağlam (context) dışındaki hiçbir bilgiyi kullanma. Cevabın kısa, profesyonel ve teknik olsun. Kullanıcıya direkt cevap ver."
        },
        {
          role: "user",
          content: `İşte Kurumsal Hafızadan gelen bilgiler:\n\n${contextText}\n\nSoru: ${query}`
        }
      ],
      temperature: 0.3, // Daha kesin/gerçekçi cevaplar için düşük sıcaklık
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({ 
        success: true, 
        answer: answer, 
        sources: matchedChunks 
    });

  } catch (error: any) {
    console.error('Oracle API Error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}

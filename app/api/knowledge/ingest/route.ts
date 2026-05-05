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
    const body = await req.json();
    const { title, content, type = 'text', source = '' } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is missing' }, { status: 500 });
    }

    // 1. Veritabanında (documents) ana kaydı oluştur
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({ title, type, source })
      .select('id')
      .single();

    if (docError || !document) {
      throw new Error(`Belge oluşturulamadı: ${docError?.message}`);
    }

    // 2. Metni Parçalara Ayır (Chunking)
    // Gerçek hayatta (LangChain vb.) daha akıllı split edilir. Şimdilik çift satır boşluklarına veya uzunluğa göre böleceğiz.
    let chunks = content.split(/\n\n+/).filter((c: string) => c.trim().length > 10);
    
    // Eğer çok uzun tek parça metinse, 1000 karaktere böl
    if (chunks.length === 1 && chunks[0].length > 1500) {
        chunks = chunks[0].match(/[\s\S]{1,1000}(?!\S)/g) || [chunks[0]];
    }

    let totalTokens = 0;

    // 3. OpenAI Embeddings (Vektörleme) ve Kayıt
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i].trim();
      if (!chunkText) continue;

      // OpenAI API çağrısı
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small', // Ucuz, hızlı ve zeki model
        input: chunkText,
      });

      const [{ embedding }] = embeddingResponse.data;
      totalTokens += embeddingResponse.usage.total_tokens;

      // Elde edilen 1536 boyutlu array'i Supabase'e kaydet
      const { error: chunkError } = await supabase
        .from('document_chunks')
        .insert({
          document_id: document.id,
          content: chunkText,
          embedding: embedding, // pgvector eklentisi bunu doğrudan kabul eder
          chunk_index: i
        });

      if (chunkError) {
        console.error("Chunk Error:", chunkError);
      }
    }

    // Toplam token maliyetini ana belgeye yaz (Analitik için)
    await supabase.from('documents').update({ token_count: totalTokens }).eq('id', document.id);

    return NextResponse.json({ 
        success: true, 
        message: 'Belge başarıyla vektörlenip hafızaya eklendi.', 
        chunks: chunks.length,
        document_id: document.id 
    });

  } catch (error: any) {
    console.error('Ingest API Error:', error);
    return NextResponse.json({ error: error.message || 'Sunucu hatası' }, { status: 500 });
  }
}

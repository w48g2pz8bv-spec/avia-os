import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client instance (Backend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Vapi'den gelen çağrı sonu raporunu dinliyoruz
    if (body.message?.type === 'end-of-call-report') {
      const { call, transcript, recordingUrl, analysis } = body.message;
      
      const callId = call.id;
      const duration = call.duration || 0;
      const status = call.status;
      const summary = analysis?.summary || '';
      const successEvaluation = analysis?.successEvaluation || '';

      // Supabase'deki vapi_calls tablosuna kaydet
      const { error } = await supabase
        .from('vapi_calls')
        .insert({
          vapi_call_id: callId,
          prospect_name: 'Gelen Çağrı (Web)', // Geliştirilecek
          duration: duration,
          status: status,
          transcript: transcript,
          recording_url: recordingUrl,
          summary: summary,
          success_eval: successEvaluation,
        });

      if (error) {
        console.error('Supabase Kayıt Hatası:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`Vapi Webhook: Çağrı kaydedildi (${callId})`);
      return NextResponse.json({ success: true, callId });
    }

    // Diğer Vapi Server URL eventleri (örn. function-call)
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

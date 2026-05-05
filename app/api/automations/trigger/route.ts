import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // For production, a service role key should be used here if bypassing RLS
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const triggerType = body.trigger_type; // e.g., 'Missed Call Detected', 'New Lead Created'
    const payload = body.payload || {};

    if (!triggerType) {
      return NextResponse.json({ error: 'Trigger type is required' }, { status: 400 });
    }

    // 1. Fetch all ACTIVE automations that match this trigger
    const { data: automations, error: fetchError } = await supabase
      .from('automations')
      .select('*')
      .eq('trigger_type', triggerType)
      .eq('status', 'active');

    if (fetchError || !automations || automations.length === 0) {
      console.log(`No active automations found for trigger: ${triggerType}`);
      return NextResponse.json({ success: true, message: 'No active automations triggered.' });
    }

    // 2. Execute each matching automation
    for (const auto of automations) {
      console.log(`🚀 Executing Automation: ${auto.title} (ID: ${auto.id})`);
      
      // Create initial log entry
      const { data: logEntry } = await supabase
        .from('automation_logs')
        .insert({
          automation_id: auto.id,
          trigger_payload: payload,
          status: 'running',
          logs: [],
        })
        .select('id')
        .single();

      const logId = logEntry?.id;
      const executionLogs: any[] = [];
      const startTime = Date.now();
      let hasError = false;

      // Ensure nodes is an array
      const nodes = Array.isArray(auto.nodes) ? auto.nodes : [];

      // 3. Step-by-Step Node Execution (The "Engine" Logic)
      for (const node of nodes) {
        // Skip trigger node logic as it already triggered
        if (node.type === 'TRIGGER') continue;

        try {
          console.log(`  -> Processing Node [${node.type}]: ${node.label}`);
          
          // --- MOCK EXECUTION LOGIC (Will be replaced with actual 3rd party API calls) ---
          // Here is where we would call Twilio for ACTION (SMS), Vapi for AI (Call), etc.
          // Example:
          // if (node.type === 'ACTION' && node.provider === 'twilio') { await twilio.send(...) }
          
          // Simulated delay for realistic DB logging
          await new Promise(resolve => setTimeout(resolve, 500)); 

          executionLogs.push({
            node_id: node.id,
            status: 'success',
            timestamp: new Date().toISOString()
          });

        } catch (err: any) {
          console.error(`  ❌ Node Failed: ${node.label}`, err);
          hasError = true;
          executionLogs.push({
            node_id: node.id,
            status: 'error',
            error: err.message || 'Unknown error',
            timestamp: new Date().toISOString()
          });
          break; // Stop execution of this workflow on failure
        }
      }

      const executionTimeMs = Date.now() - startTime;
      const finalStatus = hasError ? 'failed' : 'success';

      // 4. Update the log entry with results
      if (logId) {
        await supabase
          .from('automation_logs')
          .update({
            status: finalStatus,
            execution_time_ms: executionTimeMs,
            logs: executionLogs
          })
          .eq('id', logId);
      }

      // 5. Update Automation stats
      if (!hasError) {
        const currentStats = auto.stats || { totalRuns: 0, savedHours: 0 };
        await supabase
          .from('automations')
          .update({
            stats: {
              ...currentStats,
              totalRuns: (currentStats.totalRuns || 0) + 1,
            },
            last_run_at: new Date().toISOString()
          })
          .eq('id', auto.id);
      }
    }

    return NextResponse.json({ success: true, triggeredCount: automations.length });

  } catch (error) {
    console.error('Automation Engine Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

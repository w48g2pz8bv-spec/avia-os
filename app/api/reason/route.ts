import { NextRequest, NextResponse } from 'next/server';
import { analyzeTopicIntent, generateLocalHooks, planLocalScenes } from '@/lib/local-reasoner';

export async function POST(req: NextRequest) {
    try {
        const { situation, niche = "general", platform = "TikTok" } = await req.json();
        
        // 1. Analyze Intent
        const intent = analyzeTopicIntent(situation, niche);
        
        // 2. Generate Hooks
        const hooks = generateLocalHooks(situation, intent.mechanism, 3);
        
        // 3. Plan Scenes
        const scenes = planLocalScenes(situation, platform, intent.mechanism);
        
        return NextResponse.json({
            status: 'success',
            intent,
            hooks,
            scenes,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Neural Reasoning Error:", error);
        return NextResponse.json({ status: 'error', message: 'Reasoning failed' }, { status: 500 });
    }
}

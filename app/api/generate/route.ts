import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { buildStoryBeats } from '@/lib/planner';
import { generateScene, stitchScenes } from '@/lib/sora';
import { GenerationRequest } from '@/lib/types';

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<GenerationRequest>;

  if (!payload?.script || payload.script.trim().length < 20) {
    return NextResponse.json(
      { error: 'Script must contain at least 20 characters.' },
      { status: 400 }
    );
  }

  const generationRequest: GenerationRequest = {
    script: payload.script,
    targetDuration: payload.targetDuration ?? 480,
    visualStyle: payload.visualStyle ?? 'Neo-cinematic realism with volumetric lighting',
    musicStyle: payload.musicStyle ?? 'Atmospheric orchestral',
    voiceProfile: payload.voiceProfile ?? 'narrator-vivid'
  };

  const beats = buildStoryBeats(generationRequest.script, generationRequest.targetDuration);

  if (!beats.length) {
    return NextResponse.json({ error: 'Unable to derive story beats from the provided script.' }, { status: 422 });
  }

  const renders = await Promise.all(beats.map((beat) => generateScene(beat)));
  const combinedVideoUrl = await stitchScenes(renders);

  return NextResponse.json({
    jobId: randomUUID(),
    requestedAt: new Date().toISOString(),
    beats,
    renders,
    combinedVideoUrl
  });
}

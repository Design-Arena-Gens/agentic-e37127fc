'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { SceneRender, StoryBeat } from '@/lib/types';

const DEFAULT_SCRIPT = `Fade in:

The camera glides above a sleeping city as dawn ignites the horizon. Street lights pulse in sync with distant thunder. A lone tram curves through the mist, framing LENA, 29, a documentary director with a satchel of film reels. Her voice narrates: "Every city keeps a secret cadence. I chase those rhythms to reveal the human story beneath.".

Cut to:

INT. ARCHIVE BASEMENT - MORNING. Lena unspools reels. Dust dances in sunrise beams. She discovers a broken cassette labeled "SKY ECHO". The audio crackles with layered voices, meteorological reports, and a child humming. Her eyes widen. A forgotten sound experiment.

Montage:

Lena tracks clues across rooftop gardens, underground clubs, and an abandoned observatory. Each location reveals contributors to Sky Echo: a jazz trumpeter, a climate scientist, a VR choreographer. They speak about weaving sound to predict emotional weather.

Climax:

A storm engulfs the city. Lena coordinates the ensemble at the observatory. Instruments glow, sensors pulse, the music swells. As the storm erupts, their composition converts chaos into a wave of calming light. Citizens pause. Tears. Laughter. Release.

Fade out:

Lena records the aftermath. "The rhythm was never hidden. It waited for us to listen together." She uploads the finished film titled "Sky Echo" while the city hums in harmony.`;

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

type GenerationState = {
  beats: StoryBeat[];
  renders: SceneRender[];
  combinedVideoUrl?: string;
  jobId?: string;
  requestedAt?: string;
};

export default function Page() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [targetDuration, setTargetDuration] = useState(600);
  const [visualStyle, setVisualStyle] = useState('Cinematic documentary with volumetric lighting');
  const [musicStyle, setMusicStyle] = useState('Neo-classical with atmospheric synth layers');
  const [voiceProfile, setVoiceProfile] = useState('narrator-vivid');
  const [autoRefine, setAutoRefine] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [state, setState] = useState<GenerationState>({ beats: [], renders: [] });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          targetDuration,
          visualStyle,
          musicStyle,
          voiceProfile,
          autoRefine
        })
      });

      if (!response.ok) {
        const errorPayload = await response.json();
        throw new Error(errorPayload?.error ?? 'Failed to trigger Sora generation.');
      }

      const payload = (await response.json()) as GenerationState;
      setState(payload);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown generation error.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="glass-panel gradient-border relative overflow-hidden px-8 py-10">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-transparent" />
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-400/10 px-3 py-1 text-sm font-medium uppercase tracking-wide text-indigo-200">
              <SparklesIcon className="mr-2 h-4 w-4" /> Agentic Video Director
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Transform long-form scripts into cinematic videos with Sora2
            </h1>
            <p className="text-slate-300">
              Upload or paste your narrative, auto-compose story beats, render each sequence with Sora2, and stitch a final feature-length video. Tuned for immersive documentaries and branded storytelling.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/40"
          >
            <SparklesIcon className="h-5 w-5" />
            {isGenerating ? 'Generating...' : 'Generate with Sora2'}
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel gradient-border space-y-4 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Script</h2>
            <button
              type="button"
              onClick={() => setScript(DEFAULT_SCRIPT)}
              className="text-sm text-indigo-300 hover:text-indigo-200"
            >
              Reset sample
            </button>
          </div>
          <textarea
            value={script}
            onChange={(event) => setScript(event.target.value)}
            rows={18}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-4 font-mono text-sm text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            placeholder="Paste a long-form script or treatment..."
          />
          <p className="text-xs text-slate-400">Supports treatments up to 6,000 words. Scenes auto-derived. Voiceover mirrors the narrative unless studio mix is enabled.</p>
        </div>

        <aside className="glass-panel gradient-border space-y-6 p-6">
          <h2 className="text-lg font-semibold">Creative Controls</h2>
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Target duration (seconds)</span>
              <input
                type="number"
                value={targetDuration}
                onChange={(event) => setTargetDuration(Number(event.target.value))}
                min={120}
                max={5400}
                step={60}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Visual style directive</span>
              <input
                type="text"
                value={visualStyle}
                onChange={(event) => setVisualStyle(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Music palette</span>
              <input
                type="text"
                value={musicStyle}
                onChange={(event) => setMusicStyle(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Voice profile</span>
              <input
                type="text"
                value={voiceProfile}
                onChange={(event) => setVoiceProfile(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              />
            </label>

            <Switch.Group as="div" className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Auto enhance beats before render</span>
              <Switch
                checked={autoRefine}
                onChange={setAutoRefine}
                className={classNames(
                  autoRefine ? 'bg-indigo-500' : 'bg-slate-700',
                  'relative inline-flex h-6 w-11 items-center rounded-full transition'
                )}
              >
                <span
                  className={classNames(
                    autoRefine ? 'translate-x-5' : 'translate-x-1',
                    'inline-block h-4 w-4 transform rounded-full bg-white transition'
                  )}
                />
              </Switch>
            </Switch.Group>
          </div>
        </aside>
      </section>

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {state.beats.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Storyboard timeline</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
              {state.beats.length} beats
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {state.beats.map((beat) => {
              const render = state.renders.find((item) => item.beatId === beat.id);
              return <BeatCard key={beat.id} beat={beat} render={render} />;
            })}
          </div>
        </section>
      )}

      {state.combinedVideoUrl && (
        <section className="glass-panel gradient-border p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="space-y-2 lg:w-2/3">
              <h2 className="text-xl font-semibold">Master render</h2>
              <p className="text-sm text-slate-300">
                Preview the stitched cut delivered by Sora2. Export via the download button for handoff to your editor or client.
              </p>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
                <video
                  className="h-full w-full"
                  src={state.combinedVideoUrl}
                  controls
                  preload="metadata"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-slate-200">Job metadata</h3>
                <dl className="mt-3 space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between"><dt>Job ID</dt><dd className="truncate text-indigo-300">{state.jobId}</dd></div>
                  <div className="flex justify-between"><dt>Requested</dt><dd>{state.requestedAt}</dd></div>
                  <div className="flex justify-between"><dt>Duration budget</dt><dd>{targetDuration}s</dd></div>
                  <div className="flex justify-between"><dt>Voice</dt><dd>{voiceProfile}</dd></div>
                  <div className="flex justify-between"><dt>Music</dt><dd>{musicStyle}</dd></div>
                </dl>
              </div>
              <a
                href={state.combinedVideoUrl}
                download
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              >
                Download master cut
              </a>
            </div>
          </div>
        </section>
      )}

      {isGenerating && (
        <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
          <ArrowPathIcon className="h-5 w-5 animate-spin" />
          Sora2 is crafting your cinematic sequence...
        </div>
      )}
    </div>
  );
}

type BeatCardProps = {
  beat: StoryBeat;
  render?: SceneRender;
};

function BeatCard({ beat, render }: BeatCardProps) {
  const statusIcon = (() => {
    if (!render) return <ClockIcon className="h-5 w-5 text-slate-500" />;
    if (render.status === 'completed') return <CheckCircleIcon className="h-5 w-5 text-emerald-400" />;
    if (render.status === 'failed') return <XCircleIcon className="h-5 w-5 text-red-400" />;
    return <ArrowPathIcon className="h-5 w-5 animate-spin text-indigo-300" />;
  })();

  return (
    <article className="glass-panel gradient-border flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-sm font-semibold text-indigo-200">
            {beat.order.toString().padStart(2, '0')}
          </div>
          <h3 className="text-base font-semibold text-slate-50">{beat.title}</h3>
        </div>
        {statusIcon}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-slate-300">{beat.summary}</p>
      <dl className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div>
          <dt className="font-medium text-slate-200">Duration</dt>
          <dd>{Math.round(beat.durationSeconds)} s</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-200">Emotion</dt>
          <dd>{beat.emotionalTone}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-200">Location</dt>
          <dd>{beat.location}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-200">Status</dt>
          <dd>{render?.status ?? 'pending'}</dd>
        </div>
      </dl>
      {render?.videoUrl && (
        <video
          className="mt-4 w-full rounded-2xl border border-white/10"
          src={render.videoUrl}
          controls
          preload="metadata"
        />
      )}
      {render?.message && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{render.message}</p>
      )}
    </article>
  );
}

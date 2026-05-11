import { useEffect, useRef, useState } from 'react';

function getKey(c = '') {
  c = c.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return 'rain';
  if (c.includes('thunder') || c.includes('storm'))  return 'thunder';
  if (c.includes('snow') || c.includes('ice'))        return 'snow';
  if (c.includes('clear') || c.includes('sun'))       return 'clear';
  return 'wind';
}

function startSound(ctx, key) {
  const g = ctx.createGain();
  g.connect(ctx.destination);

  if (key === 'thunder') {
    const o = ctx.createOscillator();
    o.type = 'sawtooth'; o.frequency.value = 40; g.gain.value = 0.06;
    o.connect(g); o.start();
    return () => { try { o.stop(); } catch (_) {} g.disconnect(); };
  }

  const vol   = { rain: 0.15, snow: 0.05, clear: 0.03, wind: 0.04 }[key];
  const ftype = { rain: 'bandpass', snow: 'highpass', clear: 'lowpass', wind: 'lowpass' }[key];
  const freq  = { rain: 800, snow: 2000, clear: 300, wind: 400 }[key];

  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;

  const f = ctx.createBiquadFilter();
  f.type = ftype; f.frequency.value = freq; g.gain.value = vol;

  src.connect(f).connect(g); src.start();
  return () => { try { src.stop(); } catch (_) {} g.disconnect(); };
}

export function useWeatherAmbience(condition) {
  const [playing, setPlaying] = useState(false);
  const ctxRef  = useRef(null);
  const stopRef = useRef(null);

  useEffect(() => {
    stopRef.current?.();          // always stop previous sound first
    stopRef.current = null;

    if (!playing) {
      ctxRef.current?.suspend();  // silence any residual hum
      return;
    }

    if (!ctxRef.current) ctxRef.current = new AudioContext();
    ctxRef.current.resume();
    stopRef.current = startSound(ctxRef.current, getKey(condition));
  }, [playing, condition]);       // runs on toggle AND location change

  useEffect(() => () => stopRef.current?.(), []);

  return { playing, toggle: () => setPlaying(p => !p) };
}

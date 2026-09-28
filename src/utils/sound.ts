/**
 * Web Audio API chime synthesizer for QueueLess notifications
 * Works natively in all modern browsers with zero external audio assets.
 */

export function playChime(type: 'progress' | 'approaching' | 'your_turn' = 'progress') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'your_turn') {
      // Tri-tone cheerful ascending chime (Do-Mi-Sol-Do)
      const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } else if (type === 'approaching') {
      // Two-tone alert (A4 -> E5)
      [440, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        
        gain.gain.setValueAtTime(0.001, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.4);
      });
    } else {
      // Gentle soft single notification pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Graceful fallback if audio is blocked by user policy
  }
}

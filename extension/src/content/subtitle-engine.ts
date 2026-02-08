import type { SubtitleCue } from "@/types";

export function findCueIndexAtTime(cues: SubtitleCue[], time: number): number {
  let left = 0;
  let right = cues.length - 1;

  while (left <= right) {
    const mid = (left + right) >> 1;
    const cue = cues[mid];

    if (time < cue.start) {
      right = mid - 1;
      continue;
    }

    if (time >= cue.end) {
      left = mid + 1;
      continue;
    }

    return mid;
  }

  return -1;
}

# Local Audio Generators

This folder contains local-only scripts to generate static MP3 files used by
LingText pages and tests.

The scripts are versioned with the project. Python cache files such as
`__pycache__/` are ignored by git.

## Data page audio generator

`generate-data-audio.py` generates static MP3 files for the English text
rendered by:

- `app/routes/vocabulary/level.tsx`
- `app/routes/english-phrases.tsx`
- `app/routes/english-words-500.tsx`

It reads:

- `app/data/vocabulary-*.json`: `word` and `sentence`
- `app/data/phrases.json`: `phrase`
- `app/data/1000-words.json`: first 500 entries, `word` and `example_sentence`

Files are written under:

- `public/audio/data/vocabulary/`
- `public/audio/data/english-phrases/`
- `public/audio/data/english-words-500/`

Existing files are skipped unless you pass `--force`.

### Requirements

- Python 3
- `edge-tts`

If your system Python is externally managed, use a virtual environment.

Example:

```bash
python3 -m venv /tmp/lingtext-data-audio-venv
/tmp/lingtext-data-audio-venv/bin/pip install edge-tts
```

### How pages find the right audio

The JSON files do not store audio URLs. Instead, the frontend and the generator
share the same naming convention.

The pages call `getStaticAudioUrl()` from `app/utils/static-audio.ts` with the
same English text that is rendered on screen. For example:

```ts
getStaticAudioUrl("english-phrases", phrase);
getStaticAudioUrl("english-words-500", item.exampleSentence);
getStaticAudioUrl("vocabulary", item.word);
```

That helper converts the text into a slug, appends a deterministic hash, and
returns a public URL like:

```text
/audio/data/english-phrases/good-morning-0o8knqy.mp3
```

`generate-data-audio.py` uses the same slug and hash algorithm, so it writes the
MP3 to the exact path that the page will request.

### Basic usage

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py
```

Preview what would be generated:

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py --dry-run
```

Generate only one collection:

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py --collection english-words-500
```

Regenerate with a different voice:

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py --voice en-GB-SoniaNeural --rate -10% --force
```

### When adding new JSON data

After adding or editing English text in `app/data`, run:

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py
```

The script will:

1. Read the supported JSON files in `app/data`.
2. Extract only the English fields rendered by the target pages.
3. Calculate the expected MP3 path under `public/audio/data/`.
4. Skip the file if it already exists.
5. Generate the MP3 with `edge-tts` only when the file is missing.

Use `--dry-run` first if you want to inspect what would be generated:

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py --dry-run
```

Use `--force` only when you intentionally want to regenerate existing audio,
for example after changing the voice or speech rate:

```bash
/tmp/lingtext-data-audio-venv/bin/python scripts/local/generate-data-audio.py --force
```

If you edit an existing English phrase, word, or sentence, the resulting audio
filename will change because the filename is based on the text. After running
the script, the page will automatically point to the new filename.

## Dictation audio generator

### What the script does

`generate-dictation-audio.py` scans all files matching:

- `app/features/tests/content/*/dictation-*.ts`

For every dictation question it reads:

- `id`
- `transcript`
- `audioUrl`

Then it converts each `audioUrl` into a file path under `public/` and uses
`edge-tts` to generate the corresponding MP3.

Example:

- `audioUrl: "/audio/tests/a1/a1-dictation-1.mp3"`

becomes:

- `public/audio/tests/a1/a1-dictation-1.mp3`

### Requirements

- Python 3
- `edge-tts`

If your system Python is externally managed, use a virtual environment.

Example:

```bash
python3 -m venv /tmp/lingtext-dictation-audio-venv
/tmp/lingtext-dictation-audio-venv/bin/pip install edge-tts
```

### Basic usage

Generate all dictation audios:

```bash
/tmp/lingtext-dictation-audio-venv/bin/python scripts/local/generate-dictation-audio.py
```

Show help:

```bash
python3 scripts/local/generate-dictation-audio.py --help
```

### Options

- `--voice`
  Sets the Edge TTS voice.
  Default: `en-US-AriaNeural`

- `--rate`
  Sets speech speed.
  Default: `+0%`

- `--force`
  Overwrites existing files instead of skipping them.

- `--level`
  Generates audio only for one CEFR level.
  Allowed values: `a1`, `a2`, `b1`, `b2`, `c1`, `c2`

- `--question-id`
  Generates audio only for one specific dictation question.

### Examples

Generate only B1:

```bash
/tmp/lingtext-dictation-audio-venv/bin/python scripts/local/generate-dictation-audio.py --level b1
```

Regenerate one question:

```bash
/tmp/lingtext-dictation-audio-venv/bin/python scripts/local/generate-dictation-audio.py --question-id a1-dictation-1 --force
```

Generate with a different voice and slower speech:

```bash
/tmp/lingtext-dictation-audio-venv/bin/python scripts/local/generate-dictation-audio.py --voice en-GB-SoniaNeural --rate -10% --force
```

### Notes

- The script expects every dictation question to define a root-relative
  `audioUrl`.
- If `audioUrl` does not start with `/`, the script fails.
- If `edge-tts` is not installed, the script exits with an explicit error.
- Existing files are skipped unless you pass `--force`.

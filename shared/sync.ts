import type {
  BaseSyncMetadata,
  PhraseEntry,
  PhraseSyncField,
  SyncEnvelope,
  SyncFieldClock,
  SyncMergeResult,
  SyncPeer,
  WordEntry,
  WordSyncField,
} from "./vocabulary";

export const SYNC_SCHEMA_VERSION = 2;

const WORD_FIELDS: WordSyncField[] = [
  "word",
  "wordLower",
  "translation",
  "status",
  "addedAt",
  "voice",
  "srData",
];

const PHRASE_FIELDS: PhraseSyncField[] = [
  "phrase",
  "phraseLower",
  "translation",
  "parts",
  "addedAt",
  "srData",
];

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function cloneFields<Field extends string>(
  fields?: Partial<Record<Field, SyncFieldClock>>
): Partial<Record<Field, SyncFieldClock>> {
  return fields ? { ...fields } : {};
}

function createClock(updatedAt: number, updatedBy: SyncPeer): SyncFieldClock {
  return { updatedAt, updatedBy };
}

function resolveTimestamp(
  updatedAt: number | undefined,
  fallbackUpdatedAt: number | undefined,
  fallbackAddedAt: number | undefined
): number {
  return updatedAt ?? fallbackUpdatedAt ?? fallbackAddedAt ?? Date.now();
}

function maxClock<Field extends string>(
  fields: Partial<Record<Field, SyncFieldClock>>,
  fallbackUpdatedAt: number,
  fallbackUpdatedBy: SyncPeer
) {
  let winner = createClock(fallbackUpdatedAt, fallbackUpdatedBy);

  for (const fieldClock of Object.values(fields) as Array<
    SyncFieldClock | undefined
  >) {
    if (!fieldClock) continue;
    if (fieldClock.updatedAt > winner.updatedAt) {
      winner = fieldClock;
    }
  }

  return winner;
}

function ensureMetadata<Field extends string>(
  fields: Field[],
  existing: BaseSyncMetadata<Field> | undefined,
  hasValue: (field: Field) => boolean,
  updatedAt: number,
  updatedBy: SyncPeer
): BaseSyncMetadata<Field> {
  const nextFields = cloneFields(existing?.fields);

  for (const field of fields) {
    if (hasValue(field) && !nextFields[field]) {
      nextFields[field] = createClock(updatedAt, updatedBy);
    }
  }

  const latestClock = maxClock(
    nextFields,
    existing?.updatedAt ?? updatedAt,
    existing?.updatedBy ?? updatedBy
  );

  return {
    schemaVersion: SYNC_SCHEMA_VERSION,
    revision: Math.max(existing?.revision ?? 0, 1),
    updatedAt: latestClock.updatedAt,
    updatedBy: latestClock.updatedBy,
    fields: nextFields,
  };
}

function resolveFieldClock<Field extends string>(
  metadata: BaseSyncMetadata<Field> | undefined,
  field: Field,
  fallbackUpdatedAt: number,
  fallbackUpdatedBy: SyncPeer
): SyncFieldClock {
  return (
    metadata?.fields[field] ??
    createClock(
      metadata?.updatedAt ?? fallbackUpdatedAt,
      metadata?.updatedBy ?? fallbackUpdatedBy
    )
  );
}

function pickValue<T>(
  currentValue: T | undefined,
  currentClock: SyncFieldClock,
  incomingValue: T | undefined,
  incomingClock: SyncFieldClock
): { value: T | undefined; clock: SyncFieldClock } {
  if (!isDefined(currentValue) && !isDefined(incomingValue)) {
    return {
      value: undefined,
      clock:
        incomingClock.updatedAt >= currentClock.updatedAt
          ? incomingClock
          : currentClock,
    };
  }

  if (!isDefined(currentValue)) {
    return { value: incomingValue, clock: incomingClock };
  }

  if (!isDefined(incomingValue)) {
    return { value: currentValue, clock: currentClock };
  }

  if (incomingClock.updatedAt > currentClock.updatedAt) {
    return { value: incomingValue, clock: incomingClock };
  }

  if (incomingClock.updatedAt < currentClock.updatedAt) {
    return { value: currentValue, clock: currentClock };
  }

  return { value: incomingValue, clock: incomingClock };
}

function pickAddedAt(
  currentValue: number | undefined,
  currentClock: SyncFieldClock,
  incomingValue: number | undefined,
  incomingClock: SyncFieldClock
) {
  if (!isDefined(currentValue)) {
    return { value: incomingValue, clock: incomingClock };
  }

  if (!isDefined(incomingValue)) {
    return { value: currentValue, clock: currentClock };
  }

  if (incomingValue < currentValue) {
    return { value: incomingValue, clock: incomingClock };
  }

  return { value: currentValue, clock: currentClock };
}

function mergeClockedValue<T>(
  currentValue: T | undefined,
  currentClock: SyncFieldClock,
  incomingValue: T | undefined,
  incomingClock: SyncFieldClock
): { value: T | undefined; clock: SyncFieldClock } {
  return pickValue(currentValue, currentClock, incomingValue, incomingClock);
}

function mergeAddedAtValue(
  currentValue: number,
  currentClock: SyncFieldClock,
  incomingValue: number,
  incomingClock: SyncFieldClock
) {
  return pickAddedAt(currentValue, currentClock, incomingValue, incomingClock);
}

export function ensureWordEntrySync(
  entry: WordEntry,
  updatedBy: SyncPeer
): WordEntry {
  const updatedAt = resolveTimestamp(
    entry.updatedAt,
    entry.sync?.updatedAt,
    entry.addedAt
  );
  const metadata = ensureMetadata(
    WORD_FIELDS,
    entry.sync,
    (field) => isDefined(entry[field]),
    updatedAt,
    updatedBy
  );

  return {
    ...entry,
    updatedAt,
    sync: metadata,
  };
}

export function ensurePhraseEntrySync(
  entry: PhraseEntry,
  updatedBy: SyncPeer
): PhraseEntry {
  const updatedAt = resolveTimestamp(
    entry.updatedAt,
    entry.sync?.updatedAt,
    entry.addedAt
  );
  const metadata = ensureMetadata(
    PHRASE_FIELDS,
    entry.sync,
    (field) => isDefined(entry[field]),
    updatedAt,
    updatedBy
  );

  return {
    ...entry,
    updatedAt,
    sync: metadata,
  };
}

export function mergeWordEntries(
  currentEntry: WordEntry | undefined,
  incomingEntry: WordEntry,
  defaultPeer: SyncPeer
): WordEntry {
  const current = currentEntry
    ? ensureWordEntrySync(currentEntry, defaultPeer)
    : undefined;
  const incoming = ensureWordEntrySync(incomingEntry, defaultPeer);

  if (!current) {
    return incoming;
  }

  const nextFields: Partial<Record<WordSyncField, SyncFieldClock>> = {};
  const getCurrentClock = (field: WordSyncField) =>
    resolveFieldClock(
      current.sync,
      field,
      current.updatedAt ?? current.addedAt,
      current.sync?.updatedBy ?? defaultPeer
    );
  const getIncomingClock = (field: WordSyncField) =>
    resolveFieldClock(
      incoming.sync,
      field,
      incoming.updatedAt ?? incoming.addedAt,
      incoming.sync?.updatedBy ?? defaultPeer
    );

  const wordResult = mergeClockedValue(
    current.word,
    getCurrentClock("word"),
    incoming.word,
    getIncomingClock("word")
  );
  nextFields.word = wordResult.clock;

  const wordLowerResult = mergeClockedValue(
    current.wordLower,
    getCurrentClock("wordLower"),
    incoming.wordLower,
    getIncomingClock("wordLower")
  );
  nextFields.wordLower = wordLowerResult.clock;

  const translationResult = mergeClockedValue(
    current.translation,
    getCurrentClock("translation"),
    incoming.translation,
    getIncomingClock("translation")
  );
  nextFields.translation = translationResult.clock;

  const statusResult = mergeClockedValue(
    current.status,
    getCurrentClock("status"),
    incoming.status,
    getIncomingClock("status")
  );
  nextFields.status = statusResult.clock;

  const addedAtResult = mergeAddedAtValue(
    current.addedAt,
    getCurrentClock("addedAt"),
    incoming.addedAt,
    getIncomingClock("addedAt")
  );
  nextFields.addedAt = addedAtResult.clock;

  const voiceResult = mergeClockedValue(
    current.voice,
    getCurrentClock("voice"),
    incoming.voice,
    getIncomingClock("voice")
  );
  nextFields.voice = voiceResult.clock;

  const srDataResult = mergeClockedValue(
    current.srData,
    getCurrentClock("srData"),
    incoming.srData,
    getIncomingClock("srData")
  );
  nextFields.srData = srDataResult.clock;

  const merged: WordEntry = {
    word: wordResult.value ?? incoming.word,
    wordLower: wordLowerResult.value ?? incoming.wordLower,
    translation: translationResult.value ?? "",
    status: statusResult.value ?? "unknown",
    addedAt: addedAtResult.value ?? incoming.addedAt,
    voice: voiceResult.value,
    srData: srDataResult.value,
    isPhrase: current.isPhrase || incoming.isPhrase,
  };

  const latestClock = maxClock(
    nextFields,
    Math.max(
      current.updatedAt ?? current.addedAt,
      incoming.updatedAt ?? incoming.addedAt
    ),
    incoming.sync?.updatedBy ?? current.sync?.updatedBy ?? defaultPeer
  );

  return {
    ...merged,
    updatedAt: latestClock.updatedAt,
    sync: {
      schemaVersion: SYNC_SCHEMA_VERSION,
      revision:
        Math.max(current.sync?.revision ?? 1, incoming.sync?.revision ?? 1) + 1,
      updatedAt: latestClock.updatedAt,
      updatedBy: latestClock.updatedBy,
      fields: nextFields,
    },
  };
}

export function mergePhraseEntries(
  currentEntry: PhraseEntry | undefined,
  incomingEntry: PhraseEntry,
  defaultPeer: SyncPeer
): PhraseEntry {
  const current = currentEntry
    ? ensurePhraseEntrySync(currentEntry, defaultPeer)
    : undefined;
  const incoming = ensurePhraseEntrySync(incomingEntry, defaultPeer);

  if (!current) {
    return incoming;
  }

  const nextFields: Partial<Record<PhraseSyncField, SyncFieldClock>> = {};
  const getCurrentClock = (field: PhraseSyncField) =>
    resolveFieldClock(
      current.sync,
      field,
      current.updatedAt ?? current.addedAt,
      current.sync?.updatedBy ?? defaultPeer
    );
  const getIncomingClock = (field: PhraseSyncField) =>
    resolveFieldClock(
      incoming.sync,
      field,
      incoming.updatedAt ?? incoming.addedAt,
      incoming.sync?.updatedBy ?? defaultPeer
    );

  const phraseResult = mergeClockedValue(
    current.phrase,
    getCurrentClock("phrase"),
    incoming.phrase,
    getIncomingClock("phrase")
  );
  nextFields.phrase = phraseResult.clock;

  const phraseLowerResult = mergeClockedValue(
    current.phraseLower,
    getCurrentClock("phraseLower"),
    incoming.phraseLower,
    getIncomingClock("phraseLower")
  );
  nextFields.phraseLower = phraseLowerResult.clock;

  const translationResult = mergeClockedValue(
    current.translation,
    getCurrentClock("translation"),
    incoming.translation,
    getIncomingClock("translation")
  );
  nextFields.translation = translationResult.clock;

  const partsResult = mergeClockedValue(
    current.parts,
    getCurrentClock("parts"),
    incoming.parts,
    getIncomingClock("parts")
  );
  nextFields.parts = partsResult.clock;

  const addedAtResult = mergeAddedAtValue(
    current.addedAt,
    getCurrentClock("addedAt"),
    incoming.addedAt,
    getIncomingClock("addedAt")
  );
  nextFields.addedAt = addedAtResult.clock;

  const srDataResult = mergeClockedValue(
    current.srData,
    getCurrentClock("srData"),
    incoming.srData,
    getIncomingClock("srData")
  );
  nextFields.srData = srDataResult.clock;

  const merged: PhraseEntry = {
    phrase: phraseResult.value ?? incoming.phrase,
    phraseLower: phraseLowerResult.value ?? incoming.phraseLower,
    translation: translationResult.value ?? "",
    parts: partsResult.value ?? incoming.parts,
    addedAt: addedAtResult.value ?? incoming.addedAt,
    srData: srDataResult.value,
  };

  const latestClock = maxClock(
    nextFields,
    Math.max(
      current.updatedAt ?? current.addedAt,
      incoming.updatedAt ?? incoming.addedAt
    ),
    incoming.sync?.updatedBy ?? current.sync?.updatedBy ?? defaultPeer
  );

  return {
    ...merged,
    updatedAt: latestClock.updatedAt,
    sync: {
      schemaVersion: SYNC_SCHEMA_VERSION,
      revision:
        Math.max(current.sync?.revision ?? 1, incoming.sync?.revision ?? 1) + 1,
      updatedAt: latestClock.updatedAt,
      updatedBy: latestClock.updatedBy,
      fields: nextFields,
    },
  };
}

export function createSyncEnvelope(
  source: SyncPeer,
  words: WordEntry[],
  phrases: PhraseEntry[],
  exportedAt = Date.now()
): SyncEnvelope {
  return {
    schemaVersion: SYNC_SCHEMA_VERSION,
    source,
    exportedAt,
    words: words.map((word) => ensureWordEntrySync(word, source)),
    phrases: phrases.map((phrase) => ensurePhraseEntrySync(phrase, source)),
  };
}

export function mergeSyncEnvelopes(
  current: SyncEnvelope,
  incoming: SyncEnvelope
): SyncMergeResult {
  const wordMap = new Map<string, WordEntry>();
  const phraseMap = new Map<string, PhraseEntry>();

  for (const word of current.words) {
    wordMap.set(word.wordLower, ensureWordEntrySync(word, current.source));
  }

  for (const word of incoming.words) {
    wordMap.set(
      word.wordLower,
      mergeWordEntries(wordMap.get(word.wordLower), word, incoming.source)
    );
  }

  for (const phrase of current.phrases) {
    phraseMap.set(
      phrase.phraseLower,
      ensurePhraseEntrySync(phrase, current.source)
    );
  }

  for (const phrase of incoming.phrases) {
    phraseMap.set(
      phrase.phraseLower,
      mergePhraseEntries(
        phraseMap.get(phrase.phraseLower),
        phrase,
        incoming.source
      )
    );
  }

  return {
    words: Array.from(wordMap.values()),
    phrases: Array.from(phraseMap.values()),
  };
}

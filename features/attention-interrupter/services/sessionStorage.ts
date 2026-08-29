import { removeStoredValue, readJson, writeJson } from "@/lib/storage/jsonStore";
import { STORAGE_KEYS } from "@/lib/storage/keys";

import { AttentionSession } from "../types";

export const loadAttentionSession = (): Promise<AttentionSession | null> => readJson<AttentionSession>(STORAGE_KEYS.ATTENTION_SESSION);

export const saveAttentionSession = (session: AttentionSession): Promise<void> => writeJson(STORAGE_KEYS.ATTENTION_SESSION, session);

export const clearAttentionSession = (): Promise<void> => removeStoredValue(STORAGE_KEYS.ATTENTION_SESSION);

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import alternativesSeed from "@/data/alternatives.json";
import promptsSeed from "@/data/audio-prompts.json";
import type {
  AlternativeSuggestion,
  AlternativeWord,
  AppUser,
  AudioContribution,
  AudioPrompt,
  DatasetStats,
  TextContribution,
} from "@/types";
import { countWords } from "@/lib/utils";
import type { NewUser, StoreAdapter } from "./types";

type PersistedStore = {
  users: AppUser[];
  textContributions: TextContribution[];
  audioContributions: AudioContribution[];
  alternativeSuggestions: AlternativeSuggestion[];
  approvedAlternatives: AlternativeWord[];
  analytics: {
    textChecks: number;
    transliterations: number;
  };
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, ".store.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const emptyStore = (): PersistedStore => ({
  users: [],
  textContributions: [],
  audioContributions: [],
  alternativeSuggestions: [],
  approvedAlternatives: [],
  analytics: { textChecks: 0, transliterations: 0 },
});

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readStore(): Promise<PersistedStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return { ...emptyStore(), ...JSON.parse(raw) } as PersistedStore;
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: PersistedStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function publicUser(user: AppUser): AppUser {
  const copy = { ...user };
  delete copy.passwordHash;
  return copy;
}

function nowIso(): string {
  return new Date().toISOString();
}

function extensionFromMime(mimeType: string): string {
  if (mimeType.includes("wav")) return "wav";
  if (mimeType.includes("mpeg") || mimeType.includes("mp3")) return "mp3";
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "m4a";
  return "webm";
}

export const localStore: StoreAdapter = {
  async createUser(input: NewUser) {
    return enqueue(async () => {
      const store = await readStore();
      if (store.users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error("Bu email allaqachon ro‘yxatdan o‘tgan.");
      }
      const isFirst = store.users.length === 0;
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const role =
        input.role ??
        (isFirst || (adminEmail && adminEmail === input.email.toLowerCase()) ? "admin" : "user");
      const user: AppUser = {
        id: randomUUID(),
        email: input.email.toLowerCase(),
        name: input.name,
        role,
        createdAt: nowIso(),
        passwordHash: input.passwordHash,
      };
      store.users.push(user);
      await writeStore(store);
      return publicUser(user);
    });
  },

  async findUserByEmail(email: string) {
    const store = await readStore();
    return store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
  },

  async findUserById(id: string) {
    const store = await readStore();
    const user = store.users.find((item) => item.id === id);
    return user ? publicUser(user) : null;
  },

  async listUsers() {
    const store = await readStore();
    return store.users.map(publicUser);
  },

  async createTextContribution(input) {
    return enqueue(async () => {
      const store = await readStore();
      const item: TextContribution = {
        ...input,
        id: randomUUID(),
        status: "pending",
        createdAt: nowIso(),
      };
      store.textContributions.push(item);
      await writeStore(store);
      return item;
    });
  },

  async createAudioContribution(input) {
    return enqueue(async () => {
      const store = await readStore();
      const item: AudioContribution = {
        ...input,
        id: randomUUID(),
        status: "pending",
        createdAt: nowIso(),
      };
      store.audioContributions.push(item);
      await writeStore(store);
      return item;
    });
  },

  async listTextContributions(filter) {
    const store = await readStore();
    return store.textContributions.filter((item) => {
      if (filter?.userId && item.userId !== filter.userId) return false;
      if (filter?.status && item.status !== filter.status) return false;
      return true;
    });
  },

  async listAudioContributions(filter) {
    const store = await readStore();
    return store.audioContributions.filter((item) => {
      if (filter?.userId && item.userId !== filter.userId) return false;
      if (filter?.status && item.status !== filter.status) return false;
      return true;
    });
  },

  async updateContribution(kind, id, patch) {
    return enqueue(async () => {
      const store = await readStore();
      if (kind === "text") {
        const item = store.textContributions.find((entry) => entry.id === id);
        if (!item) return null;
        if (patch.status) item.status = patch.status;
        if (patch.category) item.category = patch.category;
        if (patch.region) item.region = patch.region;
        await writeStore(store);
        return item;
      }
      const item = store.audioContributions.find((entry) => entry.id === id);
      if (!item) return null;
      if (patch.status) item.status = patch.status;
      if (patch.region) item.region = patch.region;
      await writeStore(store);
      return item;
    });
  },

  async deleteContribution(kind, id, userId) {
    return enqueue(async () => {
      const store = await readStore();
      if (kind === "text") {
        const index = store.textContributions.findIndex((item) => item.id === id && item.userId === userId);
        if (index === -1) return false;
        store.textContributions.splice(index, 1);
        await writeStore(store);
        return true;
      }
      const index = store.audioContributions.findIndex((item) => item.id === id && item.userId === userId);
      if (index === -1) return false;
      store.audioContributions.splice(index, 1);
      await writeStore(store);
      return true;
    });
  },

  async saveAudioFile(id, bytes, mimeType) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${id}.${extensionFromMime(mimeType)}`;
    await writeFile(path.join(UPLOAD_DIR, filename), bytes);
    return `/api/audio/${filename}`;
  },

  async readAudioFile(id) {
    const files = ["webm", "wav", "mp3", "m4a"];
    const name = id.includes(".") ? id : null;
    const candidates = name ? [name] : files.map((ext) => `${id}.${ext}`);
    for (const filename of candidates) {
      try {
        const bytes = await readFile(path.join(UPLOAD_DIR, filename));
        const ext = filename.split(".").pop();
        const mimeType =
          ext === "wav"
            ? "audio/wav"
            : ext === "mp3"
              ? "audio/mpeg"
              : ext === "m4a"
                ? "audio/mp4"
                : "audio/webm";
        return { bytes, mimeType };
      } catch {
        continue;
      }
    }
    return null;
  },

  async createAlternativeSuggestion(input) {
    return enqueue(async () => {
      const store = await readStore();
      const item: AlternativeSuggestion = {
        ...input,
        id: randomUUID(),
        status: "pending",
        createdAt: nowIso(),
      };
      store.alternativeSuggestions.push(item);
      await writeStore(store);
      return item;
    });
  },

  async listAlternativeSuggestions(filter) {
    const store = await readStore();
    return store.alternativeSuggestions.filter((item) => {
      if (filter?.userId && item.userId !== filter.userId) return false;
      if (filter?.status && item.status !== filter.status) return false;
      return true;
    });
  },

  async updateAlternativeSuggestion(id, status) {
    return enqueue(async () => {
      const store = await readStore();
      const item = store.alternativeSuggestions.find((entry) => entry.id === id);
      if (!item) return null;
      item.status = status;
      if (status === "approved") {
        store.approvedAlternatives.push({
          id: randomUUID(),
          foreignWord: item.word,
          alternatives: [item.alternative],
          definition: item.explanation,
          examples: item.example ? [item.example] : [],
          category: "Boshqa",
        });
      }
      await writeStore(store);
      return item;
    });
  },

  async listApprovedAlternatives() {
    const store = await readStore();
    return store.approvedAlternatives;
  },

  async incrementCheckCount() {
    return enqueue(async () => {
      const store = await readStore();
      store.analytics.textChecks += 1;
      await writeStore(store);
    });
  },

  async incrementTransliterationCount() {
    return enqueue(async () => {
      const store = await readStore();
      store.analytics.transliterations += 1;
      await writeStore(store);
    });
  },

  async getStats(): Promise<DatasetStats> {
    const store = await readStore();
    const approvedText = store.textContributions.filter((item) => item.status === "approved");
    const approvedAudio = store.audioContributions.filter((item) => item.status === "approved");
    const pending =
      store.textContributions.filter((item) => item.status === "pending").length +
      store.audioContributions.filter((item) => item.status === "pending").length +
      store.alternativeSuggestions.filter((item) => item.status === "pending").length;
    const contributorIds = new Set(
      [...approvedText, ...approvedAudio].map((item) => item.userId),
    );
    const categories: Record<string, number> = {};
    for (const item of approvedText) {
      categories[item.category] = (categories[item.category] ?? 0) + 1;
    }
    return {
      textSamples: approvedText.length,
      audioSamples: approvedAudio.length,
      totalWords: approvedText.reduce((sum, item) => sum + item.wordCount, 0),
      contributors: contributorIds.size,
      textChecks: store.analytics.textChecks,
      transliterations: store.analytics.transliterations,
      audioSeconds: approvedAudio.reduce((sum, item) => sum + item.duration, 0),
      pendingContributions: pending,
      approvedContributions: approvedText.length + approvedAudio.length,
      totalUsers: store.users.length,
      categories,
    };
  },

  async getPromptById(id) {
    return (promptsSeed as AudioPrompt[]).find((item) => item.id === id) ?? null;
  },

  async getRandomPrompt() {
    const active = (promptsSeed as AudioPrompt[]).filter((item) => item.isActive);
    if (active.length === 0) return null;
    return active[Math.floor(Math.random() * active.length)] ?? null;
  },
};

export function seededAlternatives(): AlternativeWord[] {
  return alternativesSeed as AlternativeWord[];
}

export function countContributionWords(text: string): number {
  return countWords(text);
}

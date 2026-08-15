import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import alternativesSeed from "@/data/alternatives.json";
import type {
  AlternativeSuggestion,
  AlternativeWord,
  AppUser,
  DatasetStats,
  TextContribution,
} from "@/types";
import { countWords } from "@/lib/utils";
import type { NewUser, StoreAdapter } from "./types";

type PersistedStore = {
  users: AppUser[];
  textContributions: TextContribution[];
  alternativeSuggestions: AlternativeSuggestion[];
  approvedAlternatives: AlternativeWord[];
  analytics: {
    textChecks: number;
    transliterations: number;
  };
};

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "tillab-data") : path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, ".store.json");

const emptyStore = (): PersistedStore => ({
  users: [],
  textContributions: [],
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
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Vercel serverless filesystem is ephemeral; never fail the request.
  }
}

function publicUser(user: AppUser): AppUser {
  const copy = { ...user };
  delete copy.passwordHash;
  return copy;
}

function nowIso(): string {
  return new Date().toISOString();
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

  async listTextContributions(filter) {
    const store = await readStore();
    return store.textContributions.filter((item) => {
      if (filter?.userId && item.userId !== filter.userId) return false;
      if (filter?.status && item.status !== filter.status) return false;
      return true;
    });
  },

  async updateContribution(kind, id, patch) {
    return enqueue(async () => {
      const store = await readStore();
      if (kind !== "text") return null;
      const item = store.textContributions.find((entry) => entry.id === id);
      if (!item) return null;
      if (patch.status) item.status = patch.status;
      if (patch.category) item.category = patch.category;
      if (patch.region) item.region = patch.region;
      await writeStore(store);
      return item;
    });
  },

  async deleteContribution(kind, id, userId) {
    return enqueue(async () => {
      const store = await readStore();
      if (kind !== "text") return false;
      const index = store.textContributions.findIndex((item) => item.id === id && item.userId === userId);
      if (index === -1) return false;
      store.textContributions.splice(index, 1);
      await writeStore(store);
      return true;
    });
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
    const pending =
      store.textContributions.filter((item) => item.status === "pending").length +
      store.alternativeSuggestions.filter((item) => item.status === "pending").length;
    const contributorIds = new Set(approvedText.map((item) => item.userId));
    const categories: Record<string, number> = {};
    for (const item of approvedText) {
      categories[item.category] = (categories[item.category] ?? 0) + 1;
    }
    return {
      textSamples: approvedText.length,
      totalWords: approvedText.reduce((sum, item) => sum + item.wordCount, 0),
      contributors: contributorIds.size,
      textChecks: store.analytics.textChecks,
      transliterations: store.analytics.transliterations,
      pendingContributions: pending,
      approvedContributions: approvedText.length,
      totalUsers: store.users.length,
      categories,
    };
  },
};

export function seededAlternatives(): AlternativeWord[] {
  return alternativesSeed as AlternativeWord[];
}

export function countContributionWords(text: string): number {
  return countWords(text);
}

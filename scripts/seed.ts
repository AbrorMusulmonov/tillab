import alternatives from "../data/alternatives.json";
import prompts from "../data/audio-prompts.json";
import { seededAlternatives } from "../lib/store";

console.log(`Alternative words: ${alternatives.length}`);
console.log(`Audio prompts: ${prompts.length}`);
console.log(`Seeded alternatives via store: ${seededAlternatives().length}`);

if (alternatives.length < 50) {
  throw new Error("Need at least 50 alternative words.");
}
if (prompts.length < 20) {
  throw new Error("Need at least 20 audio prompts.");
}

console.log("Seed data is ready.");

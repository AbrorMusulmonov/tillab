import alternatives from "../data/alternatives.json";
import { seededAlternatives } from "../lib/store";

console.log(`Alternative words: ${alternatives.length}`);
console.log(`Seeded alternatives via store: ${seededAlternatives().length}`);

if (alternatives.length < 50) {
  throw new Error("Need at least 50 alternative words.");
}

console.log("Seed data is ready.");

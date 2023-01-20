import { parseFeed } from "https://deno.land/x/rss/mod.ts";
import { readJSON, writeJSON } from "https://deno.land/x/flat@0.0.15/mod.ts"

const response = await fetch(
  "http://static.userland.com/gems/backend/rssTwoExample2.xml",
);
const xml = await response.text();
const feed = await parseFeed(xml);
console.log(feed)
await writeJSON('test.json', feed)
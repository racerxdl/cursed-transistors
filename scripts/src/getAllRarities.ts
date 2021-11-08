import * as fs from "fs";

require('dotenv').config();

import { computeAllRarity } from "./scripts/computeAllRarity";
import fetch from 'node-fetch-commonjs'
// @ts-ignore
globalThis.fetch = fetch;

(async() => {
  console.log('fetching')
  const rarities = await computeAllRarity()
  console.log('saving')
  fs.writeFile('rarity.json', JSON.stringify(rarities, null, 2), (err) => {
    if (err) return console.log(err);
    console.log('done')
    process.exit(0)
  });
})()

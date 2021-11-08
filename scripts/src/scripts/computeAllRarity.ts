import {
  getMetrics,
  getTransistorData,
  getTransistorRarity,
  parseMetricData,
  SPECIAL_START_ID,
  transistorRarity
} from "../api/api";
import * as web3 from 'web3';

function toArray<X>(xs: Iterable<X>): X[] {
  // @ts-ignore
  return [...xs]
}

const specialTransistorCount = 419

const getTransistorInfo = async(idx: string, parsedMetrics: ParsedMetric) => {
  const trx = await getTransistorData(idx)
  if (trx) {
    trx.idx = idx
  }
  return {
    rarity: trx ? transistorRarity(trx, parsedMetrics) : null,
    trx,
  }
}

const computeAllRarity = async () => {
  const metrics = await getMetrics()
  const parsedMetrics = parseMetricData(metrics)
  const indexes = toArray(Array(2048).keys()).map(idx => idx.toString())
  toArray(Array(specialTransistorCount).keys())
    // @ts-ignore
    .map((idx) => web3.utils.toBN(idx).add(SPECIAL_START_ID).toString())
    .forEach((idx) => indexes.push(idx))

  const rarities = (await Promise.all(indexes.map((idx: string) => getTransistorInfo(idx, parsedMetrics))))
    .filter((r) => r.trx !== null)

  const raritySheet : any = {
    maxRarity: 0,
    minRarity: 999999,
    avgRarity: 0,
    count: 0,
    transistors: {},
    ranking: []
  }

  rarities.forEach((r) => {
    const score = getTransistorRarity(r.rarity!, 'Rarity Score')!
    raritySheet.maxRarity = Math.max(raritySheet.maxRarity, score.value)
    raritySheet.minRarity = Math.min(raritySheet.minRarity, score.value)
    raritySheet.avgRarity += score.value
    raritySheet.count++
    // @ts-ignore
    raritySheet.transistors[r.trx.idx] = r.rarity
    raritySheet.ranking.push({
      idx: r.trx!.idx!,
      score: score.value,
    })
  })

  raritySheet.avgRarity /= raritySheet.count

  raritySheet.ranking = raritySheet.ranking.sort((a: any, b: any) => -(a.score - b.score)) // desc

  return raritySheet
}

export {
  computeAllRarity,
}

import {transistorAttrToMetric} from "./metricNames";

const apiUrl = process.env.REACT_APP_API_URL;

const TYPE_COUNTER = 'COUNTER'
const TYPE_HISTOGRAM = 'HISTOGRAM'
const HISTOGRAM_DECIMATION = 4
const HISTOGRAM_MIN_BUCKET_TO_DECIMATE = 32

const getTokenData = async ({uri, idx}: any): Promise<any | null> => {
  try {
    const res = await fetch(uri)
    if (res === null) {
      return null
    }
    const data = await res.json();
    data.idx = idx;
    return data
  } catch (e) {
    console.log(e);
    return null
  }
}

const getTransistorData = async (idx: number): Promise<TransistorData | null> => {
  try {
    const res = await fetch(`${apiUrl}/transistor/${idx}`)
    if (res === null) {
      return null
    }
    return (await res.json()) as TransistorData
  } catch (e) {
    console.log(e);
    return null
  }
}

const getMetrics = async (): Promise<Array<Metric>> => {
  try {
    const res = await fetch(`${apiUrl}/metrics`)
    if (res === null) {
      return []
    }
    return (await res.json()) as Array<Metric>
  } catch (e) {
    console.log(e);
    return []
  }
}

const asCounter = (m: Metric): CounterData | null => {
  if (m.type === TYPE_COUNTER) {
    return m as CounterData
  }

  return null
}

const asHistogram = (m: Metric): HistogramData | null => {
  if (m.type === TYPE_HISTOGRAM) {
    return m as HistogramData
  }

  return null
}

const transistorType = (t: TransistorData): string => {
  return t.attributes
    .map((attr: TransistorAttribute) => attr.trait_type === "Transistor" ? attr.value : null)
    .filter((v) => v !== null)
    .join(' ')
}

const transistorVariant = (t: TransistorData): string => {
  return t.attributes
    .map((attr: TransistorAttribute) => attr.trait_type === 'Variant' ? attr.value : null)
    .filter((v) => v !== null)
    .join(' ')
}

const transistorAttribute = (t: TransistorData, name: string): number => {
  const at = t.ct_attributes
    .map((attr) => attr.Name === name ? attr.Value : null)
    .filter((v) => v !== null)

  if (at.length) {
    return at[0] || 0
  }

  return 0
}

const decimateHistogram = (buckets: StringMap): StringMap => {
  const result: StringMap = {}

  const orderedBucket = Object
    .keys(buckets)
    .map((k) => ({ok: k, k: parseFloat(k), v: buckets[k]}))
    .sort((a, b) => (a.k - b.k))

  if (orderedBucket.length < HISTOGRAM_MIN_BUCKET_TO_DECIMATE) {
    return buckets
  }

  for (let i = 0; i < orderedBucket.length - HISTOGRAM_DECIMATION; i += HISTOGRAM_DECIMATION) {
    const b = orderedBucket[i];
    result[b.ok] = b.v
  }

  // Should have first and last
  const first = orderedBucket[0];
  const last = orderedBucket[orderedBucket.length-1]

  result[first.ok] = first.v
  result[last.ok] = last.v

  return result
}

const parseMetricData = (ms?: Array<Metric>): ParsedMetric => {
  const parsed: ParsedMetric = {}
  if (!ms) {
    return parsed
  }

  for (let i = 0; i < ms.length; i++) {
    const m = ms[i];
    switch (m.name) {
      case 'imax_histogram':
        parsed.imax = asHistogram(m) || undefined;
        break
      case 'rdson_histogram':
        parsed.rdson = asHistogram(m) || undefined;
        break
      case 'total_transistors':
        parsed.total = asCounter(m) || undefined;
        break
      case 'vceon_histogram':
        parsed.vceon = asHistogram(m) || undefined;
        break
      case 'vmax_histogram':
        parsed.vmax = asHistogram(m) || undefined;
        break
      case 't_histogram':
        parsed.t = asHistogram(m) || undefined;
    }
  }

  return parsed
}

const getBucket = (value: number, histogram?: HistogramMetric): { key: string, v: number } | undefined => {
  if (!histogram) {
    return
  }

  const buckets = decimateHistogram(histogram.buckets)
  const orderedBucket = Object
    .keys(buckets)
    .map((k) => ({ok: k, k: parseFloat(k), v: parseFloat(buckets[k])}))
    .sort((a, b) => (a.k - b.k))

  for (let i = 0; i < orderedBucket.length ; i++) {
    const bucket = orderedBucket[i];
    const nextBucket = orderedBucket[i + 1]
    if (value >= bucket.k && value <= nextBucket.k) {
      return {
        key: bucket.ok,
        v: nextBucket.v - bucket.v,
      }
    }
  }

  return
}

const getHistMetric = (type: string, histogram?: HistogramData): HistogramMetric | undefined => {
  for (let i = 0; i < (histogram?.metrics.length || 0); i++) {
    if (histogram?.metrics[i].labels.type === type) {
      return histogram.metrics[i]
    }
  }

  return undefined
}

const transistorRarity = (t: TransistorData, m: ParsedMetric) => {
  const type = transistorType(t)
  return t.ct_attributes.map((attr) => {
    const metricName = transistorAttrToMetric[attr.Name]
    const attrRarity = {
      metricName,
      attrName: attr.Name,
      rate: 0,
      count: 0,
      totalCount: 0,
      unit: attr.Unit
    }

    let hist: HistogramMetric | undefined;
    switch (metricName) {
      case 'imax_histogram':
        hist = getHistMetric(type, m.imax)
        break
      case 'rdson_histogram':
        hist = getHistMetric(type, m.rdson)
        break
      case 'vceon_histogram':
        hist = getHistMetric(type, m.vceon)
        break
      case 'vmax_histogram':
        hist = getHistMetric(type, m.vmax)
        break
      case 't_histogram':
        hist = getHistMetric(type, m.t)
        break
    }

    const bucket = getBucket(attr.Value, hist)
    attrRarity.count = (bucket?.v || 0)
    attrRarity.rate = 100 * (attrRarity.count / parseFloat(hist?.count || '1'))
    attrRarity.totalCount = parseFloat(hist?.count || '0')

    return attrRarity
  })
}

export {
  TYPE_COUNTER,
  TYPE_HISTOGRAM,
  HISTOGRAM_DECIMATION,
  getTokenData,
  getTransistorData,
  getMetrics,
  asCounter,
  asHistogram,
  transistorType,
  transistorVariant,
  transistorAttribute,
  parseMetricData,
  transistorRarity,
  getHistMetric,
  decimateHistogram,
}

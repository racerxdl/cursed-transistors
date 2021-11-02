const apiUrl = process.env.REACT_APP_API_URL;

const TYPE_COUNTER = 'COUNTER'
const TYPE_HISTOGRAM = 'HISTOGRAM'

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

const transistorAttribute = (t: TransistorData, name: string) : number => {
  const at = t.ct_attributes
    .map((attr) => attr.Name === name ? attr.Value : null)
    .filter((v) => v !== null)

  if (at.length) {
    return at[0]||0
  }

  return 0
}

export {
  TYPE_COUNTER,
  TYPE_HISTOGRAM,
  getTokenData,
  getTransistorData,
  getMetrics,
  asCounter,
  asHistogram,
  transistorType,
  transistorVariant,
  transistorAttribute,
}

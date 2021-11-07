interface Metric {
  name: string
  help: string
  type: string
}

interface ParsedMetric {
  imax?: HistogramData
  rdson?: HistogramData
  t?: HistogramData
  total?: CounterData
  vceon?: HistogramData
  vmax?: HistogramData
}

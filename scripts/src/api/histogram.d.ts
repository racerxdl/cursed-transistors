type StringMap = {
  [key: string]: string
}

interface HistogramMetric {
  labels: StringMap
  buckets: StringMap
  count: string
  sum: string
}

type HistogramData = Metric & {
  metrics: Array<HistogramMetric>
}

interface CounterMetric {
  labels: StringMap
  value: string
}

type CounterData = Metric & {
  metrics: Array<CounterMetric>
}

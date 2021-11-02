const metricName: { [key: string]: string } = {
  "imax_histogram": "I (max)",
  "rdson_histogram": "RDS (on)",
  "t_histogram": "t (on)",
  "vceon_histogram": "Vce (on)",
  "vmax_histogram": "V (max)"
}

const metricUnit: { [key: string]: string } = {
  "imax_histogram": "A",
  "rdson_histogram": "Ω",
  "t_histogram": "ns",
  "vceon_histogram": "V",
  "vmax_histogram": "V"
}

const metricToTransistorAttr : { [key: string]: string } = {
  "imax_histogram": "Imax",
  "rdson_histogram": "RDS(on)",
  "t_histogram": "t",
  "vceon_histogram": "Vce(on)",
  "vmax_histogram": "Vmax"
}

export {
  metricName,
  metricUnit,
  metricToTransistorAttr,
}

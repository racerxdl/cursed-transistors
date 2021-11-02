import { useParams } from 'react-router'
import Histogram from "./graphs/histogram";
import {asHistogram, getTransistorData, transistorAttribute, transistorType} from "./api/api";
import {metricName, metricToTransistorAttr, metricUnit} from "./api/metricNames";
import {useEffect, useState} from "react";

const markWithTransistor = (m: HistogramData, hm: HistogramMetric, transistorData: TransistorData|null) => {
  let mark;
  if (transistorData) {
    const tType = transistorType(transistorData)
    mark = transistorAttribute(transistorData, metricToTransistorAttr[m.name])
    if (hm.labels.type !== tType) {
      return (<div/>)
    }
  }

  return <Histogram
    title={`${hm.labels.type} - ${metricName[m.name]}`}
    yLabel={"# Transistors"}
    data={hm}
    width={500}
    height={250}
    mark={mark}
    xLabel={metricUnit[m.name]}
  />
}

export default function MetricsPage({metrics}: {metrics?: Array<Metric>}) {
  const { id } = useParams<any>();
  const [transistorData, setTransistorData] = useState<TransistorData|null>(null);

  useEffect(() => {
    if (id) {
      getTransistorData(id)
        .then(setTransistorData)
    }
  }, [id])

  const metricView = metrics?.map((metric: Metric) => {
    const hist = asHistogram(metric)
    if (hist !== null) {
      return hist.metrics.map((hm: HistogramMetric) => markWithTransistor(hist, hm, transistorData))
    }
    return (<div/>)
  })

  return (
    <div>
      <p>Metrics Page for {id}</p>
      <div>{metricView}</div>
      <p>T</p>
    </div>
  )
}

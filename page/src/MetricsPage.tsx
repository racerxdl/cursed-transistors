import {useParams} from 'react-router'
import Histogram from "./graphs/histogram";
import {
  asHistogram, decimateHistogram,
  getTransistorData,
  parseMetricData,
  transistorAttribute,
  transistorRarity,
  transistorType
} from "./api/api";
import {metricName, metricToTransistorAttr, metricUnit} from "./api/metricNames";
import {useEffect, useState} from "react";
import {Avatar, Card, CardContent, Grid, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";

const markWithTransistor = (m: HistogramData, hm: HistogramMetric, transistorData: TransistorData | null) => {
  let mark;
  if (transistorData) {
    const tType = transistorType(transistorData)
    if (hm.labels.type !== tType) {
      return (<div/>)
    }
    mark = transistorAttribute(transistorData, metricToTransistorAttr[m.name])
  }

  return <Card sx={{minWidth: 275, margin: 1}}>
    <CardContent>
      <Histogram
        title={`${hm.labels.type} - ${metricName[m.name]}`}
        yLabel={"# Transistors"}
        data={{
          ...hm,
          buckets: decimateHistogram(hm.buckets)
        }}
        width={420}
        height={180}
        mark={mark}
        xLabel={metricUnit[m.name]}
      />
    </CardContent>
  </Card>
}

export default function MetricsPage({metrics}: { metrics?: Array<Metric> }) {
  const {id} = useParams<any>();
  const [transistorData, setTransistorData] = useState<TransistorData | null>(null);
  const parsedMetrics = parseMetricData(metrics)

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

  let transistorContent = (<div>{metricView}</div>)

  if (transistorData) {
    const rarityData = transistorRarity(transistorData, parsedMetrics)
    const rarityList = rarityData.map((m) => {
      return (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              {m.unit}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primaryTypographyProps={{style: {color: 'white'}}}
                        primary={m.attrName}
                        secondary={`(${m.count}/${m.totalCount}) ${Math.round(m.rate * 100) / 100} %`}
          />
        </ListItem>
      )
    })

    transistorContent = (
      <Grid container spacing={1}>
        <Grid item xs/>
        <Grid item xs={5}>
          <br/>
          <img alt={transistorData.name} src={transistorData.image} style={{maxWidth: '48vh'}}/>
          <br/>
          <br/>
          <List sx={{bgcolor: 'background.paper'}}>
            <ListItem>
              <h3 style={{color: "white"}}>{`Transistor: ${transistorData.name} #${id}`}</h3>
            </ListItem>
            {rarityList}
          </List>
        </Grid>
        <Grid item xs={5}>{metricView}</Grid>
        <Grid item xs/>
      </Grid>
    )
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {transistorContent}
    </div>
  )
}

import {useParams} from 'react-router'
import {useEffect, useState} from "react";
import {
  Avatar, Backdrop,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import * as React from "react";
import web3 from "web3";
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';

import Histogram from "./graphs/histogram";
import paintSwapLogo from './logos/paintswap.png'
import artionLogo from './logos/artion_white.svg'
import {
  asHistogram, decimateHistogram,
  getTransistorData,
  parseMetricData, SPECIAL_START_ID,
  transistorAttribute,
  transistorRarity,
  transistorType
} from "./api/api";
import {metricName, metricToIcon, metricToTransistorAttr, metricUnit} from "./api/metricNames";
import {toNotationUnit} from "./tools";

const markWithTransistor = (m: HistogramData, hm: HistogramMetric, transistorData: TransistorData | null) => {
  let mark;
  if (transistorData) {
    const tType = transistorType(transistorData)
    if (hm.labels.type !== tType) {
      return (<div/>)
    }
    mark = transistorAttribute(transistorData, metricToTransistorAttr[m.name])
  }

  return <Grid item>
    <Card sx={{minWidth: 275}}>
      <CardContent>
        <Histogram
          title={`${hm.labels.type} - ${metricName[m.name]}`}
          yLabel={"# Transistors"}
          data={{
            ...hm,
            buckets: decimateHistogram(hm.buckets)
          }}
          width={420}
          height={220}
          mark={mark}
          xLabel={metricUnit[m.name]}
        />
      </CardContent>
    </Card>
  </Grid>
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
    const sid = web3.utils.toBN(id).sub(SPECIAL_START_ID);
    const isSpecial = sid.gt(web3.utils.toBN('0x0'));
    const idx = isSpecial ? `S${sid.toString()}` : id;
    const rarityData = transistorRarity(transistorData, parsedMetrics)
    const rarityList = rarityData.map((m) => {
      const [v, u] = toNotationUnit(m.value);
      const svalue = m.unit !== 'ns' ? `${v} ${u}${metricUnit[m.metricName]}` : `${m.value} ${m.unit}`
      const avatar = metricToIcon[m.metricName]
      const secondary = metricUnit[m.metricName] === 'Points' ? '' : `(${m.count}/${m.totalCount}) ${Math.round(m.rate * 100) / 100} %`

      return (
        <ListItem>
          <ListItemAvatar>
            <Avatar>{avatar}</Avatar>
          </ListItemAvatar>
          <ListItemText primaryTypographyProps={{style: {color: 'white'}}}
                        primary={`${m.attrName} = ${svalue}`}
                        secondary={secondary}
          />
        </ListItem>
      )
    })

    transistorContent = (
      <Grid container spacing={1} marginTop={1}>
        <Grid item xs/>
        <Grid item xs={5}>
          <img alt={transistorData.name} src={transistorData.image} style={{maxWidth: '100%'}}/>
          <Box sx={{bgcolor: 'background.paper'}} borderRadius={2}>
            <List>
              <ListItem style={{textAlign: 'center'}}>
                <h3 style={{color: "white", width: '100%'}}>{`${transistorData.name} # ${idx}`}</h3>
              </ListItem>
              {rarityList}
              <ListItem>
                <ListItemAvatar>
                  <img src={artionLogo} alt="artion logo" width='32'/>
                </ListItemAvatar>
                <a href={`https://artion.io/explore/${process.env.REACT_APP_CURSED_CONTRACT}/${id}`}><h3
                  style={{color: "white"}}>Trade & Sell in Artion</h3></a>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <img src={paintSwapLogo} alt="paintswap logo" width='32'/>
                </ListItemAvatar>
                <a href={`https://paintswap.finance/marketplace/assets/${process.env.REACT_APP_CURSED_CONTRACT}/${id}`}>
                  <h3
                    style={{color: "white"}}>Trade & Sell in Paintswap</h3></a>
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={1}>
            {metricView}
          </Grid>
        </Grid>
        <Grid item xs/>
      </Grid>
    )
  }

  if (id && (!transistorData || !metrics)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 1200,
        margin: 'auto',
      }}>
        Please wait
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    )
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 1200,
      margin: 'auto',
    }}>
      {transistorContent}
    </div>
  )
}

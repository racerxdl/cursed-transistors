import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import WaterIcon from '@mui/icons-material/Water';
import * as React from "react";

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
  "vmax_histogram": "V",
  "Rarity Score": "Points"
}

const metricToTransistorAttr: { [key: string]: string } = {
  "imax_histogram": "Imax",
  "rdson_histogram": "RDS(on)",
  "t_histogram": "t",
  "vceon_histogram": "Vce(on)",
  "vmax_histogram": "Vmax"
}

const transistorAttrToMetric: { [key: string]: string } = {
  "Imax": "imax_histogram",
  "RDS(on)": "rdson_histogram",
  "t": "t_histogram",
  "Vce(on)": "vceon_histogram",
  "Vmax": "vmax_histogram"
}

const metricToIcon: { [key: string]: any } = {
  "vmax_histogram": (<BatteryChargingFullIcon/>),
  "t": (<AccessTimeIcon/>),
  "rdson_histogram": "Ω",
  "vceon_histogram": (<BatterySaverIcon/>),
  "Rarity Score": (<StarBorderPurple500Icon/>),
  "imax_histogram": (<WaterIcon/>)
}

export {
  metricName,
  metricUnit,
  metricToIcon,
  metricToTransistorAttr,
  transistorAttrToMetric,
}

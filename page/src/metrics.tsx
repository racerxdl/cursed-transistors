import d3 from 'd3';
import React, {useRef} from 'react';


export default function Metrics() {
  const metricRef = useRef<any>();

  d3.select(metricRef.current)
    .append('p')
    .text("Hello world")

  return <div ref={metricRef}/>
}

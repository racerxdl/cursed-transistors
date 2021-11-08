import {useD3} from "../hooks/useD3";
import * as d3 from 'd3';
import {toNotationUnit} from "../tools";

interface HistogramComponentData {
  width: number
  height: number
  data: HistogramMetric
  title?: string
  xLabel?: string
  yLabel?: string
  mark?: number
}

const notateBucket = (k: string) : string => {
  const [val, unit] = toNotationUnit(parseFloat(k));
  return `${val} ${unit}`;
}

export default function Histogram({data, width, height, xLabel, yLabel, title, mark}: HistogramComponentData) {
  const ref = useD3(
    (svg: any) => {
      const margin = {top: 20, right: 30, bottom: 30, left: 30};
      const markVal = mark ? mark : 0

      if (xLabel) {
        margin.bottom += 10;
      }

      if (yLabel) {
        margin.left += 10;
      }

      if (title) {
        margin.top += 15
      }

      const contentWidth = width - (margin.left + margin.right)
      const contentHeight = height - (margin.top + margin.bottom)
      svg.attr("width", width)
        .attr("height", height)

      const metrics: { [key: number]: number } = {};
      const keys: Array<number> = []
      let max = -100000000;
      let lastValue = 0;
      let markBucket : string = "";
      Object.keys(data.buckets)
        .sort((a,b) => parseFloat(a) - parseFloat(b))
        .forEach((k: string, idx: number, lkeys: Array<string>) => {
        const nk = parseFloat(k);
        const nv = parseFloat(data.buckets[k]);
        metrics[nk] = nv - lastValue;
        lastValue = nv;
        keys.push(nk);
        max = Math.max(max, metrics[nk]);
        if (nk <= markVal) {
          markBucket = notateBucket(lkeys[idx+1])
        }
      })

      // Trim right
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        if (metrics[key] !== 0) {
          break
        }
        delete (metrics[key]);
        keys.splice(i, 1)
      }

      const xScale = d3.scaleBand()
        .range([0, contentWidth])
        .domain(keys.map((k: number) => notateBucket(k.toString())))
        .padding(0.2)


      svg.selectAll(".x-axis")
        .call(d3.axisBottom(xScale))
        .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
        .style("color", "steelblue")
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")

      const yScale = d3.scaleLinear()
        .domain([0, max])
        .range([contentHeight, 0])

      svg.selectAll(".y-axis")
        .call(d3.axisLeft(yScale))
        .style("color", "steelblue")
        .attr("transform", `translate(${margin.left},${margin.top})`)

      svg
        .select(".plot-area")
        .attr("fill", "steelblue")
        .selectAll(".bar")
        .data(keys)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d: number) => xScale(notateBucket(d.toString())))
        .attr("y", (d: number) => yScale(metrics[d]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d: number) => yScale(0) - yScale(metrics[d]))
        .attr("transform", `translate(${margin.left},${margin.top})`)

      if (yLabel) {
        svg.selectAll(".y-label")
          .data([""])
          .join('text')
          .attr("fill", "white")
          .attr("class", "y-label")
          .attr("text-anchor", "middle")
          .attr("y", 0)
          .attr("dy", "0.75em")
          .attr("width", contentHeight)
          .attr("x", -height / 2)
          .attr("transform", "rotate(-90)")
          .text(yLabel)
      }

      if (xLabel) {
        svg.selectAll(".x-label")
          .data([""])
          .join('text')
          .attr("fill", "white")
          .attr("class", "x-label")
          .attr("text-anchor", "end")
          .attr("y", height)
          .attr("width", contentWidth)
          .attr("x", width - margin.right)
          .text(xLabel)
      }

      if (title) {
        svg.selectAll(".title-label")
          .data([""])
          .join('text')
          .attr("fill", "white")
          .attr("class", "title-label")
          .attr("text-anchor", "middle")
          .attr("y", 15)
          .attr("width", width)
          .attr("x", width / 2)
          .text(title)
      }

      if (mark) {
        svg.selectAll(".mark-bar")
          .data([""])
          .join('rect')
          .attr("class", "mark-bar")
          .attr("fill", "red")
          .attr("x", (xScale(markBucket)|| 0) + xScale.bandwidth() / 2)
          .attr("y", 0)
          .attr("width", 1)
          .attr("height", contentHeight)
          .attr("transform", `translate(${margin.left},${margin.top})`)

        svg.selectAll(".mark-label")
          .data([""])
          .join('text')
          .attr("fill", "red")
          .attr("class", "mark-label")
          .attr("text-anchor", "middle")
          .attr("y", -2.5)
          .attr("width", width)
          .attr("x", (xScale(markBucket)|| 0) + xScale.bandwidth() / 2)
          .text(notateBucket(mark.toString()))
          .attr("transform", `translate(${margin.left},${margin.top})`)
      }
    },
    [xLabel, yLabel, width, height, data]
  );

  return (
    <svg
      ref={ref}
    >
      <g className="plot-area"/>
      <g className="x-axis"/>
      <g className="y-axis"/>
    </svg>
  );
}

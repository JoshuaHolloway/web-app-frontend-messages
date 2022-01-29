import React, { useRef, useEffect } from 'react';
import { select, scaleLinear, line, max, curveCardinal, axisBottom, axisLeft, brushX } from 'd3';
import css from './App.module.scss';
import usePrevious from './usePrevious';
import useResizeObserver from './useResizeObserver';

// ==============================================

export default function BrushChart({
  data,
  data_labels,
  selection,
  setSelection,
}: {
  data: number[];
  data_labels: string[];
  selection: any; //number[];
  setSelection: (arr: number[]) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<any>();
  const dimensions = useResizeObserver(wrapperRef);
  // const [selection, setSelection] = useState<number[]>([]);
  const previousSelection = usePrevious(selection);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = scaleLinear()
      .domain([0, max(data)!])
      .range([height, 0]);

    const lineGenerator: any = line()
      .x((d, index: number) => xScale(index))
      .y((d: any) => yScale(d))
      .curve(curveCardinal);

    // render the line
    svg
      .selectAll('.myLine')
      .data([data])
      .join('path')
      .attr('class', 'myLine')
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('d', lineGenerator);

    svg
      .selectAll('.myDot')
      .data(data)
      .join('circle')
      .attr('class', 'myDot')
      .attr('stroke', 'black')
      .attr('r', (value: any, index: number) => (index >= selection[0] && index <= selection[1] ? 5 : 4))
      .attr('fill', (value: any, index: number) =>
        index >= selection[0] && index <= selection[1] ? 'darkorange' : 'deepskyblue'
      )
      .attr('cx', (value: any, index: number) => xScale(index))
      .attr('cy', yScale);

    // axes
    const xAxis: any = axisBottom(xScale);
    xAxis.tickFormat((d: any, i: number) => data_labels[i]).ticks(data_labels.length);
    svg.select('.x-axis').attr('transform', `translate(0, ${height})`).call(xAxis);

    // rotate x-axis labels:
    svg
      .select('.x-axis')
      .selectAll('text')
      .attr('transform', 'translate(-10,10)rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', 20)
      .style('fill', '#69a3b2');

    const yAxis: any = axisLeft(yScale);
    svg.select('.y-axis').call(yAxis);

    // console.log('selection: ', selection);

    // brush
    const brush: any = brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('start brush end', (event) => {
        if (event.selection) {
          const indexSelection = event.selection.map(xScale.invert);
          setSelection(indexSelection);
        }
      });

    // initial position + retaining position on resize
    if (previousSelection === selection) {
      svg.select('.brush').call(brush).call(brush.move, selection.map(xScale));
    }
  }, [data, dimensions, previousSelection, selection]);

  return (
    <>
      <small style={{ marginBottom: '1rem' }}>
        Selected values: [
        {data.filter((value, index: number) => index >= selection[0] && index <= selection[1]).join(', ')}]
      </small>

      <div ref={wrapperRef} style={{ margin: '2rem 2rem 12rem 2rem' }}>
        <svg className={css.svg} ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="brush" />
        </svg>
      </div>
    </>
  );
}

// ==============================================

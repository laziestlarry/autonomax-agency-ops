import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SentimentData {
  sector: string;
  intensity: number;
  volume: number;
  trend: 'rising' | 'stable' | 'declining';
}

const data: SentimentData[] = [
  { sector: 'AI Dev Tools', intensity: 92, volume: 85, trend: 'rising' },
  { sector: 'Micro-SaaS', intensity: 88, volume: 78, trend: 'rising' },
  { sector: 'FinTech', intensity: 76, volume: 62, trend: 'stable' },
  { sector: 'HealthTech', intensity: 82, volume: 70, trend: 'rising' },
  { sector: 'EdTech', intensity: 68, volume: 55, trend: 'declining' },
  { sector: 'GreenTech', intensity: 79, volume: 68, trend: 'rising' },
  { sector: 'Web3/Blockchain', intensity: 56, volume: 42, trend: 'declining' },
  { sector: 'No-Code', intensity: 84, volume: 74, trend: 'rising' },
];

export const SentimentChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const width = chartRef.current.clientWidth || 500;
    const height = 220;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.sector))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.sector) || 0)
      .attr('y', d => yScale(d.intensity))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.intensity))
      .attr('fill', d => {
        if (d.trend === 'rising') return '#6F42C1';
        if (d.trend === 'stable') return '#d97706';
        return '#78716c';
      })
      .attr('opacity', 0.85)
      .attr('rx', 4);

    // Volume dots
    svg.selectAll('.volume-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => (xScale(d.sector) || 0) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.intensity) - 12)
      .attr('r', d => 3 + (d.volume / 100) * 6)
      .attr('fill', '#d97706')
      .attr('opacity', 0.7);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#78716c')
      .style('font-size', '9px')
      .style('font-family', 'Inter, sans-serif');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d}%`))
      .style('color', '#78716c')
      .style('font-size', '9px')
      .style('font-family', 'Inter, sans-serif');

    // Grid lines
    svg.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .style('stroke', '#292524')
      .style('stroke-dasharray', '4,4')
      .style('stroke-width', 0.5);

  }, []);

  return (
    <div className="w-full">
      <div ref={chartRef} className="w-full" />
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-[#78716c]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#6F42C1] opacity-85" />
          Rising
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#d97706] opacity-85" />
          Stable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#78716c] opacity-85" />
          Declining
        </span>
        <span className="flex items-center gap-1.5 ml-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] opacity-70" />
          Volume
        </span>
      </div>
    </div>
  );
};

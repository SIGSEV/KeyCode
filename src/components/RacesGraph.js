import React, { Component } from 'react'
import * as d3 from 'd3'

import { lowerMap } from 'helpers/text'
import { getColor } from 'helpers/colors'

const SECTIONS = 5
const HEIGHT = 500
const WIDTH = 900
const MARGINS = { top: 50, bottom: 50 }

class RacesGraph extends Component {
  componentDidMount() {
    const { races } = this.props

    const first = new Date(races[0].createdAt)
    const last = new Date(races[races.length - 1].createdAt)

    const diff = Math.abs(first.getTime() - last.getTime())
    const days = Math.ceil(diff / (1000 * 3600 * 24))
    const int = Math.round(days / SECTIONS)

    const groups = [...Array(SECTIONS).keys()].map(i =>
      new Date(first.getFullYear(), first.getMonth(), first.getDate() + i * int).getTime(),
    )

    const grouped = races.reduce((acc, race) => {
      const raceTime = new Date(race.createdAt).getTime()
      const { index } = groups.reduce(
        (acc, cur, index) => {
          const d = Math.abs(raceTime - cur)
          return acc.index === -1 || acc.diff > d ? { index, diff: d } : acc
        },
        { index: -1 },
      )

      acc[index].push(race)

      return acc
    }, [...Array(SECTIONS)].map(() => []))

    const svg = d3
      .select(this.svg)
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .append('g')
      .attr('transform', `translate(0, ${MARGINS.top})`)

    const scoreExtent = d3.extent(races, d => d.score)
    const yScale = d3
      .scaleLinear()
      .domain(scoreExtent)
      .rangeRound([HEIGHT - MARGINS.top - MARGINS.bottom, 0])

    const yAxis = d3
      .axisRight()
      .scale(yScale)
      .ticks(14)

    svg
      .append('g')
      .attr('class', 'axis')
      .call(yAxis)

    grouped.forEach((group, i) => {
      const simulation = d3
        .forceSimulation(group)
        .force('x', d3.forceY(d => yScale(d.score)).strength(1))
        .force('y', d3.forceX(HEIGHT / 2))
        .force('collide', d3.forceCollide(10))
        .stop()

      for (let i = 0; i < 120; ++i) {
        simulation.tick()
      }

      svg
        .append('g')
        .attr('transform', `translate(${i * 150}, 0)`)
        .attr('class', 'group')
        .selectAll('.group')
        .data(group)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('fill', d => getColor(lowerMap[d.language]))
        .attr('r', 6)
        .attr('stroke-width', 2)
        .on('mouseover', d => console.log(d))
    })
  }

  render() {
    return (
      <div>
        <svg ref={c => (this.svg = c)} />
      </div>
    )
  }
}

export default RacesGraph

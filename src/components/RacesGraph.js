import React, { Component } from 'react'
import styled from 'styled-components'
import * as d3 from 'd3'

import { lowerMap } from 'helpers/text'
import { getColor } from 'helpers/colors'

const Container = styled.div`
  .axis {
    font-family: monospace;
    path {
      stroke-dasharray: 5, 5;
    }
  }
`

const SECTIONS = 5
const MARGINS = { top: 10, bottom: 10 }

class RacesGraph extends Component {
  componentDidMount() {
    const { races, width, height } = this.props

    console.log(width, height)

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
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(0, ${MARGINS.top})`)

    const scoreExtent = d3.extent(races, d => d.score)
    const yScale = d3
      .scaleLinear()
      .domain(scoreExtent)
      .rangeRound([height - MARGINS.top - MARGINS.bottom, 0])

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
        .force('y', d3.forceX(height / 2))
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
      <Container>
        <svg ref={c => (this.svg = c)} />
      </Container>
    )
  }
}

export default RacesGraph

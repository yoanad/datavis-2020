import React, { Component } from "react";
import * as d3 from "d3";
import "./BarChart.css";

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden,
    }

    this.sample = this.props.sample;
    this.scale = this.props.scale;
    this.title = this.props.title;
    this.group = this.props.group;
    this.id = this.props.id;
  
    this.drawChart = this.drawChart.bind(this);
    this.wrap = this.wrap.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isHidden !== prevProps.isHidden) {
      this.setState ({
        isHidden: this.props.isHidden
      })
    }
    this.drawChart();
  }

  drawChart() {
    const svg = d3.select(`#${this.id}`);
    const margin = 100;
    const width = 1400 - 2 * margin;
    const height = 900 - 2 * margin;

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(this.sample.map(s => s.language))
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, this.scale]);

    const makeYLines = () => d3.axisLeft().scale(yScale);

    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    chart.append("g").call(d3.axisLeft(yScale));

    chart
      .append("g")
      .attr("class", "grid")
      .call(
        makeYLines()
          .tickSize(-width, 0, 0)
          .tickFormat("")
      );

    
    const ticks = svg.selectAll(".tick");
    ticks.selectAll("text").call(this.wrap, 150);

    const barGroups = chart
      .selectAll()
      .data(this.sample)
      .enter()
      .append("g");

    barGroups
      .append("rect")
      .attr("class", "bar")
      .attr("x", g => xScale(g.language))
      .attr("y", g => yScale(g.value))
      .attr("height", g => height - yScale(g.value))
      .attr("width", xScale.bandwidth())
      .attr("fill", g => g.color)

      .on("mouseenter", function(actual, i) {
        d3.selectAll(".value").attr("opacity", 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 0.6)
          .attr("x", a => xScale(a.language) - 5)
          .attr("width", xScale.bandwidth() + 10);

        const y = yScale(actual.value);

        chart
          .append("line")
          .attr("id", "limit")
          .attr("x1", 0)
          .attr("y1", y)
          .attr("x2", width)
          .attr("y2", y);

        barGroups
          .append("text")
          .attr("class", "divergence")
          .attr("x", a => xScale(a.language) + xScale.bandwidth() / 2)
          .attr("y", a => checkAdjustmentY(a))
          .attr("fill", "white")
          .attr("text-anchor", "middle")
          .text((a, idx) => {
            const divergence = (a.value - actual.value).toFixed(1);

            let text = "";
            if (divergence > 0) text += "+";
            text += `${divergence}%`;

            return idx !== i ? text : "";
          });
      })
      .on("mouseleave", function() {
        d3.selectAll(".value").attr("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("opacity", 1)
          .attr("x", a => xScale(a.language))
          .attr("width", xScale.bandwidth());

        chart.selectAll("#limit").remove();
        chart.selectAll(".divergence").remove();
      });

    barGroups
      .append("text")
      .attr("class", "value")
      .attr("x", a => xScale(a.language) + xScale.bandwidth() / 2)
      .attr("y", a => checkAdjustmentY(a))
      .attr("text-anchor", "middle")
      .text(a => `${a.value}%`);

    svg
      .append("text")
      .attr("class", "label")
      .attr("x", -(height / 2) - margin)
      .attr("y", margin / 2.4)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Prevalence (in %)");

    svg
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 + margin)
      .attr("y", height + margin * 2.5)
      .attr("text-anchor", "middle")
      .text(this.group);

    svg
      .append("text")
      .attr("class", "title")
      .attr("x", width / 2 + margin)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text(this.title);

    svg
      .append("text")
      .attr("class", "source")
      .attr("x", width - margin * 2.5)
      .attr("y", height + margin * 3)
      .attr("text-anchor", "start")
      .text("Source: National Alliance on Mental Illness");

      function checkAdjustmentY(a) {
        if (a.value <= 2) {
          return yScale(a.value) - 10;
        } else {
          return yScale(a.value) + 50;
        }
      }
  }

  wrap(text, width) {

    console.log(text )

    text.each(function(el, i) {
      console.log(this)
      var text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y * line)
            .attr("dy", lineHeight + "em")
            .text(word);
        }
      }
    });
  }

  render() {
    return (
      <div className={this.state.isHidden ? 'is-hidden container' : 'container'}>
        <svg id={this.id} viewBox="0 0 1400 1000"></svg>
      </div>
    );
  }
}

export default BarChart;

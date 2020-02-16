const sample2 = [
  {
    language: 'All adults',
    value: 19,
    color: colors[0]
  },
  {
    language: 'Asian adults',
    value: 15,
    color: colors[1]
  },
  {
    language: 'Black adults',
    value: 16,
    color: colors[2]
  },
  {
    language: 'Hispanic or Latin adults',
    value: 17,
    color: colors[3]
  },
  {
    language: 'White adults',
    value: 20,
    color: colors[4]
  },
  {
    language: 'Adult, who report mixed / multiracial',
    value: 27,
    color: colors[5]
  },
  {
    language: 'Lesbian, gay and bisexual adults',
    value: 37,
    color: colors[6]
  }
];

const svg2 = d3.select('#vis2');
const svgContainer2 = d3.select('#container-2');

const margin = 100;
const width = 1400 - 2 * margin;
const height = 900 - 2 * margin;

const chart = svg.append('g')
  .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
  .range([0, width])
  .domain(sample2.map((s) => s.language))
  .padding(0.1)

const yScale = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 100]);

const makeYLines = () => d3.axisLeft()
  .scale(yScale)

chart.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

chart.append('g')
  .call(d3.axisLeft(yScale));

chart.append('g')
  .attr('class', 'grid')
  .call(makeYLines()
    .tickSize(-width, 0, 0)
    .tickFormat('')
  )

d3.selectAll("text").call(wrap, 150); /* your container width */

const barGroups = chart.selectAll()
  .data(sample)
  .enter()
  .append('g')

barGroups
  .append('rect')
  .attr('class', 'bar')
  .attr('x', (g) => xScale(g.language))
  .attr('y', (g) => yScale(g.value))
  .attr('height', (g) => height - yScale(g.value))
  .attr('width', xScale.bandwidth())
  .attr('fill', (g) => g.color)
  
  .on('mouseenter', function (actual, i) {
    d3.selectAll('.value')
      .attr('opacity', 0)

    d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 0.6)
      .attr('x', (a) => xScale(a.language) - 5)
      .attr('width', xScale.bandwidth() + 10)

    const y = yScale(actual.value)

    line = chart.append('line')
      .attr('id', 'limit')
      .attr('x1', 0)
      .attr('y1', y)
      .attr('x2', width)
      .attr('y2', y)

    barGroups.append('text')
      .attr('class', 'divergence')
      .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
      .attr('y', (a) => yScale(a.value) + 50)
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((a, idx) => {
        const divergence = (a.value - actual.value).toFixed(1)
        
        let text = ''
        if (divergence > 0) text += '+'
        text += `${divergence}%`

        return idx !== i ? text : '';
      })

  })
  .on('mouseleave', function () {
    d3.selectAll('.value')
      .attr('opacity', 1)

    d3.select(this)
      .transition()
      .duration(300)
      .attr('opacity', 1)
      .attr('x', (a) => xScale(a.language))
      .attr('width', xScale.bandwidth())

    chart.selectAll('#limit').remove()
    chart.selectAll('.divergence').remove()
  })

barGroups 
  .append('text')
  .attr('class', 'value')
  .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
  .attr('y', (a) => yScale(a.value) + 50)
  .attr('text-anchor', 'middle')
  .text((a) => `${a.value}%`)

svg2
  .append('text')
  .attr('class', 'label')
  .attr('x', -(height / 2) - margin)
  .attr('y', margin / 2.4)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Prevalence (in %)')

svg2.append('text')
  .attr('class', 'label')
  .attr('x', width / 2 + margin)
  .attr('y', height + margin * 2.5)
  .attr('text-anchor', 'middle')
  .text('Adult groups')

svg2.append('text')
  .attr('class', 'title')
  .attr('x', width / 2 + margin)
  .attr('y', 40)
  .attr('text-anchor', 'middle')
  .text('12 month prevalence of any mental illness (all U.S. adults)')

svg2.append('text')
  .attr('class', 'source')
  .attr('x', width - margin * 2.5)
  .attr('y', height + margin * 3)
  .attr('text-anchor', 'start')
  .text('Source: National Alliance on Mental Illness')

function wrap(text, width) {
  text.each(function() {
    // debugger
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y * line).attr("dy", lineHeight +  "em").text(word);
        console.log(lineNumber);
      }
    }
  }
)};

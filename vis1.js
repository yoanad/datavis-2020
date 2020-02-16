// https://insights.stackoverflow.com/survey/2018/#technology-most-loved-dreaded-and-wanted-languages

// Group,Value
// All adults,19
// Asian adults,15
// Black adults,16
// Hispanic or Latin adults,17
// White adults,20
// Adults who report mixed/multiracial,27
// Lesbian gay and bisexual adults,37
// ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]
const sample = [
  {
    language: 'All Adults',
    value: 19,
    color: '#4e79a7'
  },
  {
    language: 'Asian adults',
    value: 15,
    color: '#f28e2c'
  },
  {
    language: 'Black adults',
    value: 16,
    color: '#e15759'
  },
  {
    language: 'Hispanic or Latin adults',
    value: 17,
    color: '#76b7b2'
  },
  {
    language: 'White adults',
    value: 20,
    color: '#edc949'
  },
  {
    language: 'Adults who report mixed/multiracial',
    value: 27,
    color: '#ff6e52'
  },
  {
    language: 'Lesbian, gay and bisexual adults',
    value: 37,
    color: '#af7aa1'
  }
];

const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 1400 - 2 * margin;
const height = 900 - 2 * margin;

const chart = svg.append('g')
  .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
  .range([0, width])
  .domain(sample.map((s) => s.language))
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
      .attr('y', (a) => yScale(a.value) + 30)
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
  .attr('y', (a) => yScale(a.value) + 30)
  .attr('text-anchor', 'middle')
  .text((a) => `${a.value}%`)

svg
  .append('text')
  .attr('class', 'label')
  .attr('x', -(height / 2) - margin)
  .attr('y', margin / 2.4)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .text('Prevalence (in %)')

svg.append('text')
  .attr('class', 'label')
  .attr('x', width / 2 + margin)
  .attr('y', height + margin * 3)
  .attr('text-anchor', 'middle')
  .text('Adult groups')

svg.append('text')
  .attr('class', 'title')
  .attr('x', width / 2 + margin)
  .attr('y', 40)
  .attr('text-anchor', 'middle')
  .text('12 month prevalence of any mental illness (all U.S. adults)')

svg.append('text')
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

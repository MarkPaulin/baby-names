function drawChart(data) {
  const svg = d3.select('#chart');

  const width = 600,
    height = 400,
    margin = {top: 50, right: 50, bottom: 50, left: 50};

  const ranks = Object.keys(data).map(d => {
    return {
      name: d,
      ranks: Object.values(data[d])
    };
  });

  const years = Object.keys(data[ranks[0]['name']]);

  const rankScale = d3.scaleLinear()
    .domain([1, 100])
    .range([margin.bottom, height - margin.top]);

  const yearScale = d3.scaleLinear()
    .domain(d3.extent(years))
    .range([margin.left, width - margin.right]);

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('id', 'yAxis')
    .attr('class', 'axis')
    .call(d3.axisLeft(rankScale).tickValues([1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]));

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .attr('id', 'xAxis')
    .attr('class', 'axis')
    .call(d3.axisBottom(yearScale).tickFormat(d3.format('')));

  const line = d3.line()
    .defined(d => d != null)
    .x((d, i) => yearScale(years[i]))
    .y(d => rankScale(d));

  const path = svg.selectAll('path.line')
      .data(ranks)
    .join('path')
      .attr('class', 'line')
      .attr('id', d => d.name)
      .attr('d', d => line(d.ranks))
      .on('click', () => highlight(line));
}

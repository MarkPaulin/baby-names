function drawChart(data) {
  clearSelection();
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
      .attr('d', d => line(d.ranks));


  function hover(svg, path) {
    svg.style('position', 'relative');

    svg.on('mousemove', moved)
      .on('mouseout', left)
      .on('click', clicked);

    function moved() {
      d3.event.preventDefault();
      const ym = rankScale.invert(d3.event.layerY);
      const xm = yearScale.invert(d3.event.layerX);
      const i1 = d3.bisect(years, xm, 1);
      const i0 = i1 - 1;
      const i = xm - years[i0] > years[i1] - xm ? i1: i0;
      const s = ranks.reduce((a, b) => Math.abs(a.ranks[i] - ym) < Math.abs(b.ranks[i] - ym) ? a : b);
      path.classed('hovered', d => d.name === s.name);

      d3.select('#hoverName')
          .style('background-color', '#bebebe')
          .text(s.name)
    }

    function left() {
      d3.event.preventDefault();
      path.classed('hovered', false);
      d3.select('#hoverName')
        .style('background', 'none')
        .html('');
    }

    function clicked() {
      d3.event.preventDefault();
      const name = d3.select('.hovered').attr('id');
      if (highlighted.indexOf(name) == -1) {
        highlight(name);
      }
    }
  }

  svg.call(hover, path);

  const first = ranks[0]['name'];
  highlight(first);
}

function initialiseCanvas() {
  const width = 600,
    height = 400;

  const svg = d3.select("#chartArea")
    .append("svg")
      .attr("id", "chart")
      .attr("width", width)
      .attr("height", height);
}

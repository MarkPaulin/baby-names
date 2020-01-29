initialiseCanvas();

d3.json('data/girl_names.json').then(data => {
  drawChart(data);
  highlight('Emily');
  highlight('Amelia');
});

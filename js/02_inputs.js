var freeColours = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f'];
var usedColours = []

const names = d3.select('#highlightName');

function highlight(n) {
  var line = d3.select(`path.line#${n}`);
  var col = freeColours.pop();
  usedColours.push(col);

  line.classed('highlight', true);
  line.style('stroke', col);

  names.append('span')
      .attr('id', n)
      .attr('class', 'highlighted')
      .style('background-color', col)
      .text(n)
    .append('span')
      .attr('class', 'remove')
      .text('x')
      .on('click', () => unhighlight(n));
}


function unhighlight(n) {
  var line = d3.select(`path.line#${n}`);

  var col = line.style('stroke');
  usedColours.pop(col);
  freeColours.push(col);

  line.style('stroke', 'lightgrey');
  line.classed('highlight', false);

  d3.select(`#${n}`).remove();
}

function inputName(name) {
  var line = d3.select(`path.line#${name}`);
  if (!line.empty()) {
    highlight(name);
  } else {

  }
  document.getElementById('highlightInput').value = '';
}

function inputPress(e) {
  if (e.keyCode == 13) {
    inputName(document.getElementById('highlightInput').value);
  }
}

const colourPalette = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f'];
var freeColours = colourPalette.slice();
var usedColours = [];

var highlighted = [];

const names = d3.select('#highlightName');

function highlight(n) {
  if (highlighted.length == colourPalette.length) {
    var nameOut = highlighted[0];
    unhighlight(nameOut);
  }

  highlighted.push(n);

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
  highlighted.splice(highlighted.indexOf(n), 1);
  var line = d3.select(`path.line#${n}`);

  var col = line.style('stroke');
  usedColours.splice(usedColours.indexOf(col), 1);
  freeColours.push(col);

  line.style('stroke', 'lightgrey');
  line.classed('highlight', false);

  d3.select(`#${n}`).remove();
}

function inputName(name) {
  name = titleCase(name);
  var line = d3.select(`path.line#${name}`);
  if (!line.empty() & highlighted.indexOf(name) == -1) {
    highlight(name);
  }
  document.getElementById('highlightInput').value = '';
}

function inputPress(e) {
  if (e.keyCode == 13) {
    inputName(document.getElementById('highlightInput').value);
  }
}

function clearSelection() {
  freeColours = colourPalette.slice();
  usedColours = [];
  highlighted = [];

  d3.selectAll('path.line')
    .style('stroke', 'lightgrey')
    .classed('highlight', false);

  d3.select('#highlightName').html('');
}

function titleCase(str) {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

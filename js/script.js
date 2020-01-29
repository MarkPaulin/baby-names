initialiseCanvas();

var files = ['data/girl_names.json', 'data/boy_names.json'];

var promises = [];

const nameData = [];

files.forEach(f => promises.push(d3.json(f)));

Promise.all(promises).then(data => {
  nameData.push(data[0], data[1]);
  drawChart(data[0]);
});

function drawFemale() {
  drawChart(nameData[0]);
}

function drawMale() {
  drawChart(nameData[1]);
}

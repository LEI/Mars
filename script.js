var x, y,
	z = 100,
	size = 50,
	square = 5;

function init() {
	map = {},
	tmp = {};
	for (x=0; x<size; x++) {
		map[x] = {};
		tmp[x] = {};
		for (y=0; y<size; y++) {
			// Traitement du type de terrain
			map[x][y] = { 'z' : Math.floor((Math.random() * z)) + 1, 'type' : '' };
			tmp[x][y] = { 'z' : 0, 'type' : '' };
		}
	}
}

function soften(array) {
	for (x=0; x<size; x++) {
		for (y=0; y<size; y++) {

			// points = {	'aa' : tab[x-1][y-1], 'ab' : tab[x][y-1], 'ac' : tab[x+1][y-1],
			// 			'ba' : tab[x-1][y], 'bb' : tab[x][y], 'bc' : tab[x+1][y],
			// 			'ca' : tab[x-1][y+1], 'cb' : tab[x][y+1], 'cc' : tab[x+1][y+1] };

			var avg = [];
			avg.push(array[x][y].z);

			if (x!=0) {
				if (y!=0) {
					avg.push(array[x-1][y-1].z);
				}
				if (y!=(size-1)) {
					avg.push(array[x-1][y+1].z);
				}
				avg.push(array[x-1][y].z);
			} else if (x!=(size-1)) {
				if (y!=0) {
					avg.push(array[x+1][y-1].z);
				}
				if (y!=(size-1)) {
					avg.push(array[x+1][y+1].z);
				}
				avg.push(array[x+1][y].z);
			}

			var total = 0;
			var length = avg.length;
			for (var i=0; i<avg.length; i++) {
				total += avg[i];
			}

			tmp[x][y].z =  Math.floor(total/length);

		}
	}

	return tmp;
}

var renderCount=0;
function render(array) {
	var table = '<div id="download'+renderCount+'"><table>';
	for (x=0; x<size; x++) {
		table += '<tr>';
		for (y=0; y<size; y++) {
			table += '<td style="width : ' + square + 'px; height: ' + square + 'px; background-color: hsl(50,50%,' + array[x][y].z + '%)"></td>';
		}
		table +='</tr>';
	}
	table +='</table></div>';

	document.write(table);
	save(array);
	renderCount++;
}

function save(array) {
	var json = JSON.stringify(array, undefined, '\t');
	//console.log(array);
	//console.log(json);
	var blob = new Blob([json], {type: "application/json"});
	var url  = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.download = "data"+renderCount+".json";
	a.href = url;
	a.textContent = "data"+renderCount	+".json";

	document.getElementById('download'+renderCount).appendChild(a);
}

init();
render(map);

var map2 = soften(map);
render(map2);

var map3 = soften(map2);
render(map3);
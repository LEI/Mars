var x, y,
	z = 100,
	size = 50;

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

function render(array) {
	document.write('<table>');
	for (x=0; x<size; x++) {
		document.write('<tr>');
		for (y=0; y<size; y++) {
			document.write('<td style="background-color: hsl(200,50%,'+array[x][y].z+'%)"></td>');
		}
		document.write('</tr>');
	}
	document.write('</table>');
}

function save(array) {
	var json = JSON.stringify(array, undefined, 2);
	console.log(array);
	//console.log(json);
	var blob = new Blob([json], {type: "application/json"});
	var url  = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.download = "data.json";
	a.href = url;
	a.textContent = "Download data.json";

	document.getElementById('content').appendChild(a);
}

init();
render(map);
var newMap = soften(map);
render(newMap);
save(newMap);
function Map()
{
	this.groundType = [
		'Roche',
		'Sable',
		'Minerai',
		'Fer',
		'Glace',
		'Autre'];

	this.groundWeight = [
		0.4,
		0.2,
		0.2,
		0.1,
		0.1,
		0.0];

	Map.prototype.init = function(size, softness) {
		this.z = 50;
		this.size = size;
		this.softness = softness;
		this.map = [];
		this.tmp = [];
		/*for (x=0; x<this.size; x++) {
			this.map[x] = [];
			this.tmp[x] = [];
			for (y=0; y<this.size; y++) {
				// Hauteur entre -50 et 50 (converti en 0-100 pour la luminosité dans renderCanvas)
				this.map[x][y] = { 'z' : this.rand(-this.z,this.z) };
				// Récupération d'un type de matière pour le fichier JSON final
				this.tmp[x][y] = { 'type' : this.getGroundType() };//, 'x': x, 'y': y };
			}
		}*/
		for (var i=0; i<size*size; i++) {
			this.map[i] = { 'z' : this.rand(-this.z,this.z), 'type' : this.getGroundType() };
			//this.tmp[i] = { 'type' : this.getGroundType() };
		}
		this.create();
	};

	Map.prototype.create = function() {
		while (this.softness >= 0) {
			if (this.softness == 0) {

				this.createJson();

			} else {
				// Lissage
				//this.soften(this.map);
			}
			this.softness--;
		}
	};

	// Création du fichier JSON
	Map.prototype.createJson = function() {
		// Ajout de la taille de la carte pour exportation
		var data = { "size": this.size, "map": 	this.xyArray(this.map,this.size) };
		this.json = JSON.stringify(data, undefined, '\t');
		this.url = "data:application/octet-stream;base64," + Base64.encode(this.json);
	};

	Map.prototype.soften = function(map) {
		// A modifier pour un tableau à une dimension
		for (var x=0; x<this.size; x++) {
			for (var y=0; y<this.size; y++) {

				/*var squareZ = {
					'left-top': 	map[x-1][y-1].z,
					'top': 			map[x][y-1].z,
					'right-top': 	map[x+1][y-1].z,

					'left': 		map[x-1][y].z,
					'here': 		map[x][y].z,
					'right': 		map[x][y+1].z,

					'left-bot': 	map[x-1][y+1].z,
					'bot': 			map[x][y+1].z,
					'right-bot': 	map[x+1][y+1].z,
				};*/
				/*if (map[x-1][y-1] != undefined) avg.push(map[x-1][y-1].z);
				if (map[x][y-1] != undefined) avg.push(map[x][y-1].z);
				if (map[x+1][y-1] != undefined) avg.push(map[x+1][y-1].z);

				if (map[x-1][y] != undefined) avg.push(map[x-1][y].z);
				if (map[x][y] != undefined) avg.push(map[x][y].z);
				if (map[x][y+1] != undefined) avg.push(map[x][y+1].z);

				if (map[x-1][y+1] != undefined) avg.push(map[x-1][y+1].z);
				if (map[x][y+1] != undefined) avg.push(map[x][y+1].z);
				if (map[x+1][y+1] != undefined) avg.push(map[x+1][y+1].z);*/

				var avg = [];

				avg.push(map[x][y].z);

				if (x!=0) {
					if (y!=0) {
						//avg.push(map[x][y-1].z);
						avg.push(map[x-1][y-1].z);
					}
					if (y!=(this.size-1)) {
						//avg.push(map[x][y+1].z);
						avg.push(map[x-1][y+1].z);
					}
					avg.push(map[x-1][y].z);
				}

				if (x!=(this.size-1)) {
					if (y!=0) {
						//avg.push(map[x][y-1].z);
						avg.push(map[x+1][y-1].z);
					}
					if (y!=(this.size-1)) {
						//avg.push(map[x][y+1].z);
						avg.push(map[x+1][y+1].z);
					}
					avg.push(map[x+1][y].z);
				}

				if (y!=0) {
					avg.push(map[x][y-1].z);
				}

				if (y!=(this.size-1)) {
					avg.push(map[x][y+1].z);
				}

				var total = 0;
				var length = avg.length;
				for (var i=0; i<length; i++) {
					total += avg[i];
				}

				// Mise à jour de la hauteur
				this.tmp[x][y].z =  Math.floor(total/length);

				// Transfert du type de terrain dans le nouveau tableau (déjà enregistré dans tmp lors de init)
				//this.tmp[x][y].type = map[x][y].type;
			}
		}

		this.map = this.tmp;
	};

	Map.prototype.getGroundType = function() {

		// Gestion de la répartition du terrain (en fonction des coordonnées ?)

		// Récupère un élément dans le tableau en fonction des probabilités
		var random_item = this.getRandomItem(this.groundType, this.groundWeight);

		for (var i=0; i<this.groundType.length; i++) {
			if (random_item == this.groundType[i]) {
				// Retour de l'index du terrain
				return i+1;
			}
		}
	};

	Map.prototype.getRandomItem = function(list, weight) {
		var total_weight = weight.reduce(function (prev, cur, i, arr) {
			return prev + cur;
		});
		var random_num = this.rand(0, total_weight);
		var weight_sum = 0;
		//console.log(random_num)
		for (var i = 0; i < list.length; i++) {
			weight_sum += weight[i];
			weight_sum = +weight_sum.toFixed(2);

			if (random_num <= weight_sum) {
				return list[i];
			}
		}
	};

	Map.prototype.rand = function(min, max) {
		return Math.random() * (max - min) + min;
	};

	// Retourne un tableau à une dimension
	Map.prototype.mergeArray = function(array) {
		var newArray = [];
		for (var x=0; x<array.length; x++) {
			for (var y=0; y<array.length; y++) {
				newArray.push(array[x][y]);
			}
		}
		return newArray;
	};

	// Retourne un tableau à deux dimensions
	Map.prototype.xyArray = function(array, size) {
		var i = 0, newArray = [];
		for (var x=0; x<size; x++) {
			newArray[x] = [];
			for (var y=0; y<size; y++) {
				// push ne fonctionne pas sur [x][y]
				newArray[x].push(array[i]);
				i++;
			}
		}
		return newArray;
	};
}

// Data URI
var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}
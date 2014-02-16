function Ground()
{
	this.groundType = [
		'Roche',
		'Sable',
		'Minerai',
		'Fer',
		'Glace',
		'Autre'
	];

	this.groundWeight = [
		0.5,
		0.3,
		0.2,
		0.2,
		0.1,
		0.0
	];

	Ground.prototype.getType = function() {
		// Récupère un élément dans le tableau en fonction des probabilités
		var random_item = this.getRandomItem(this.groundType, this.groundWeight);

		for (var i=0; i<this.groundType.length; i++) {
			if (random_item == this.groundType[i]) {
				// Retour de l'index du terrain
				return i;
			}
		}
	};

	Ground.prototype.getRandomItem = function(list, weight, output_index) {
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
				if(output_index == undefined)
					return list[i];
				else
					return i;
			}
		}
	};

	Ground.prototype.rand = function(min, max) {
		return Math.random() * (max - min) + min;
	};
}

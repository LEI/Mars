# Mars

ToDo
---

`getGroundType()`
Gérer la répartion du terrain

`soften()`
Algorithme

`render()`
three.js ?

Carte
===

Format
---

La carte est carré (`size`) et composée de cases (`point`) ayant une position à 3 dimensions et une matière.

Type de matière
---

* 1 Roche
* 2 Sable
* 3 Minerai
* 4 Fer
* 5 Glace
* 6 Autre

JSON
---

Les données de la carte sont stockées en JSON (JavaScript Object Notation)
Les coordonnées X et Y sont déduites de leurs positions dans le tableau.

	{
		size : {
			x : 2,
			y : 2
		},
		map : [
			[
				{
					z : 0,
					type : 1
				},
				{
					z : 0,
					type : 1
				}
			],
			[
				{
					z : 0,
					type : 1
				},
				{
					z : 0,
					type : 1
				}
			]
		]
	}

Rover
===


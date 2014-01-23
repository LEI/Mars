#Mars

##Carte

La carte est **carrée**, chaque case est positionnée sur **3 axes** et composée d'une **matière**. Ces informations sont enregistrées dans un fichier **JSON** (JavaScript Object Notation).

###Matières

| Type | Probabilité | Index |
|:---------:|:---:|:-:|
| Roche     | 0.? | 1 |
| Sable 	| 0.? | 2 |
| Minerai 	| 0.? | 3 |
| Fer     	| 0.? | 4 |
| Glace   	| 0.? | 5 |
| Autre   	| 0.? | 6 |

###JSON

Les coordonnées `x` et `y` sont définies par l'index de chaque case dans le tableau.
La hauteur `z` (-50, 50) et le `type` de matière (1, 6) sont générés aléatoirement.
L'élément `size` définit la taille de la carte.

####1 case = 5 mètres ?

```json
{
	"size": 2,
	"map": [
		[
			{
				"z": 0,
				"type": 1
			},
			{
				"z": 0,
				"type": 1
			}
		],
		[
			{
				"z": 0,
				"type": 1
			},
			{
				"z": 0,
				"type": 1
			}
		]
	]
}
```

##Rover

***

Clic droit pour ouvrir le JSON dans un nouvel onglet ou clic gauche pour enregistrer le fichier.

##[notes]

- *Jusqu'à une prochaine MAJ de correction, la carte doit avoir une largeur et une hauteur de la forme* **4n+1**.
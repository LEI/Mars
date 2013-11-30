#Mars



##Carte

La carte est **carrée**, chaque case est positionnée sur **trois axes** et composée d'une **matière**. Ces informations sont enregistrées dans un fichier **JSON** (JavaScript Object Notation).

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

Les coordonnées `x` et `y` sont définies par leur position dans le tableau.
La hauteur `z` et le `type` de matière sont générés aléatoirement pour chaque case.
L'élément `size` définit la taille de la carte.

###1 case = 5 mètres ?

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

>Générer un Rover qui se déplace sur la carte.

>On commence le jeu avec un "capital énergie", et une position choisie.

>A chaque "tour", le Rover a le choix pour se diriger sur une des 8 cases qui entourent celle où il se trouve.

>La "pente" entre deux cases est un pourcentage qui se calcule ainsi : p = (z2 - z1) / déplacement

>Un Rover ne peut se déplacer sur une pente à plus de 150% : sinon il glisse et tombe.

>Se déplacer d'une case coute E, à savoir 1 point énergie, sauf pour les diagonales, qui coutent 1,4.

>En montée, ou en descente, le cout énergétique est E x (1 + p).
>Monter une pente sableuse demande 0,1 E en plus
>Descendre une pente sableuse demande 0,1 E en moins.

>Le Rover a des palpeurs qui permettent de déterminer la composition du sol où il se trouve.
>Déterminer la composition du sol coute 0.1 E
>Pour une case adjacente, cela coûte 0,2E.
>Pour une case au delà, cela coûte 0,4E.

>Connaitre la pente entre la case où le Rover se trouve et une adjacente est gratuit. Calculer la pente pour les cases 1 cran plus loin coute 0.1 par case.

>Une case "Glace" permet de faire le plein d'énergie.

>But : Tester et gérer le déplacement du Rover, suivant un chemin quelconque (stratégie basique)


#ToDo

`getGroundType()`

 Améliorer la répartition des types de matière

`soften()`

 Algorithme

`render()`

 three.js ?

***

Clic droit pour ouvrir le JSON dans un nouvel onglet ou clic gauche pour enregistrer le fichier.
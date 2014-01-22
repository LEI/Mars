#To do

###Terrain

`Ground.js` Améliorer la répartition des types de matière

###Algorithme

`Rover.move()` IA

Diamond square
http://srchea.com/blog/2012/02/terrain-generation-the-diamond-square-algorithm-and-three-js/

http://potch.me/18

###Rover

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

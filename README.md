# faux-passeports-DCS
 Diagramme de Sankey représentant les flux géographiques des faux passeports vendus sur le darkweb

Cette visualisation originale a été choisi car elle est compréhensible de manière instinctive et permet de visualiser particulièrement bien les flux. Le but était de mettre en valeur les différents marqueurs géographiques impliqués lors de la vente d'un faux passport sur un site du darkweb. Chaque passport a obligatoirement 4 marqueurs géographiques, ce qui crée trois "noeuds" par annonce. Un noeud est composé d'un marqueur d'origine et d'un marqueur de destination, ainsi que d'une épaisseur représentant le nombre d'annonces présentant ce binôme. 

Ce diagramme a été crée en 3 grandes étapes :
## aquisition et analyse des données 
le crawling et le parsing des données ont eu lieu entre octobre et décembre 2019, à l'aide de scripts python dans le cadre du cours Investigation et Veille sur Internet (David-Olivier Jacquet Chiffelle et Quentin Rossy, ESC)
## préparation du data set
le script create-dataset.py permet d'extraire les données nécéssaires à la visualisation de données. Il  crée les binômes "départ-destination" pour chacun des noeuds et calcule l'épaisseur de chaque noeud en fonction du nombre d'annonces présentant cette configuration. 
## création du diagramme de Sankey 
La visualisation a été créé en javascript en s'inspirant d'un modèle trouvé sur ObservableHQ https://observablehq.com/@d3/sankey-diagram 
Notre visualisation peut également être visionnée sur ce site à l'adresse https://observablehq.com/d/37c4a8b8cd704fbc@318

Pour visualiser le Diagramme de Sankey depuis github, il suffit d'ouvrir index.html dans un navigateur. On peut ensuite passer la souris sur chaque noeud et chaque flux pour connaitre le nombre d'annonces représentées.
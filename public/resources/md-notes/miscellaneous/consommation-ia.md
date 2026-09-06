# Consommation hydrique de l’IA

## Contexte

On entend que l'IA consomme beaucoup de litres d'eaux par recherche et que c'est une catastrophe.

- Faits documentés : des villes entières voient leurs nappes phréatiques pompées par les _datacenters_ hébergeants des serveurs sur lesquelles tournent des modèles d'IA (eg. aux USA).

- 2023 : Des universitaires cherchent à estimer la consommation de GPT-3 en eau. Ils estiment que pour l'entraînement du modèle, les _datacenters_ de Microsoft ont évaporé 700 000 litres d'eau (douce), soit 500mL pour 10 à 50 réponses d'une longueur "moyenne".
- Sur ces 500mL, seuls 2mL servent réellement à la requête (voir après).

- Sam Altman : 0.32mL pour une requête ChatGPT moyenne. -> pas de méthode claire
- Google : 0.25mL pour une requête (5 gouttes). -> uniquement sur le refroidissement

## Nuances

- C'est le coût pour le **cycle total de l'énergie** qui est calculée dans l'étude de 2023 (dont la "création" de l'électricité).
- Donc : ça dépend beaucoup de la zone géographique du serveur et des types d'énergie utilisée (comparer les centrales à charbon aux USA et les centrales nucléaires).
- Pour comparer, en Arizona, les terrains de golf consomment 32x plus d'eau que les _datacenters_.
- En France, les datacenters c'est 7.5 TWh 575 000 m^3 d'eau en un an. Pour les terrains de golf, c'est 29 000 000 m^3 d'eau par an.

## Utilisation de l'eau par un datacenter

- L'électricité ressort sous la forme de chaleur. L'eau sert au refroidissement.
- L'eau doit être potable (pour éviter d'abîmer les machines).
- L'eau n'est pas **perdue**, elle s'évapore l'air et revient dans le cycle de l'eau.

Donc il faut distinguer : consommation (on retire l'eau de son milieu, elle s'évaporera autre part) et prélèvement (on déplace légèrement d'une source vers une autre).

Donc le problème ce n'est pas d'utiliser de l'eau pour l'IA, mais :
- d'utiliser beaucoup d'eau, dans une zone qui en manque (**stress hydrique**)

(eg. faire un datacenter dans le Texas _vs_ à Quimper)

## Pistes d'amélioration

- Il y a des innovations locales qui réutilisent la chaleur des _datacenters_ pour chauffer des quartiers (D4 - Infomaniak à Genève, certaines piscines et serres à Paris, etc.).
- C'est une question de volonté des propriétaires de _datacenter_.
- Il faut travailler sur les **sources d'énergie** : décarbonner l'énergie (on est dans les meilleurs en France). Les _datacenters_ en France (nucléaire, barrages électriques) seraient plus écoresponsables que ceux au Texas (gaz, charbon) à consommation égale.
- Arrêter de faire des terrains de golfs.

## Conclusion

- Les _datacenters_ consomment de l'eau de manière **modérée**.
- Il y a des scandales sur l'utilisation de l'eau par l'IA (eau non déclarée, non facturée, etc.).
- L'emplacement et le type d'énergie utilisé est très important pour mesurer la quantité d'eau _(le datacenter en lui-même n'utilisant que peu d'eau relativement à la production de son électricité)_.
- C'est un choix politique : le _datacenter_ a une utilité (production, médecine, recherche, tout le secteur tertiaire, etc.), ce qui n'est pas le cas de toutes les autres pompeurs d'eau (golfs, piscines, etc.).

La "bonne" question : **combien d'eau pour quoi faire ? avec qu'elle énergie ? où ? avec quel qualité de contrôle ?**.

## Sources

Numerama (https://www.youtube.com/watch?v=Qddzc5iqP5U) - sources en description

## Biais pré-recherches

- L'IA consomme autant d'eau par requête que pour une recherche Google.
- Les modèles de génération d'image (vidéos, etc.) consomment "énormément".

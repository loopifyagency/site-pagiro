---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html (site vitrine Pagiro)

Mode : Persuade. Visiteur : habitant de Brest, souvent sur mobile, qui veut vérifier le salon, les horaires, puis réserver (Planity) ou appeler. Preuves réelles : 5 photos, 5 avis verbatim, horaires, adresse. Contraintes : pas de tarifs, pas de chiffres inventés, pas d'eyebrow au-dessus des titres, pas de grain feTurbulence, icônes dessinées en SVG.

## Direction contract

THESIS: le miroir. Les images clés (hero, rendez-vous, boutique, carte) sont vues à travers un miroir à cadre argenté perlé (arche), traversé par un reflet de lumière ; le salon est la preuve, le miroir est le cadre qui la montre. Refuse l'arrangement standard du salon : photo plein écran + titre serif centré + trois cartes icône + étoiles.

OWN-WORLD: crème #F4ECDF en fond, blanc nacré pour les reflets, beige lin en grands aplats (sections entières), cacao pour le texte et les sections sombres, sable doré pour les filets, argent froid (dégradé métal) pour les cadres de miroirs contre la chaleur du beige, une seule touche orchidée (les chaises acryliques) réservée aux détails vivants. Titres en Bricolage Grotesque (écho à l'enseigne géométrique), texte en Hanken Grotesk. Composants : cadres en arche à perlage, ligne de coupe en pointillés où voyage une paire de ciseaux dessinés, boutons pilule cacao qui se remplissent de sable.

STORY: en une seconde, le visiteur comprend « salon de coiffure mixte à Brest, lumineux, équipe qui écoute » ; il croit ce que disent les clients (avis verbatim) et ce que montrent les photos ; il réserve sur Planity ou appelle ; l'action reste à portée : bouton dans l'en-tête (qui réapparaît au scroll vers le haut), appel final plein cadre, bouton « Appeler » flottant sur mobile.

FIRST VIEWPORT: grand miroir en arche centré (≈ 40vw × 82svh sur desktop, cadre argenté perlé, photo des quatre miroirs, reflet qui balaie la vitre). Le mot « Pagiro » en géant (≈ 18vw) traverse le miroir au premier plan, ses lettres entrent par un masque qui monte. Bas gauche : phrase d'accroche + bouton « Prendre rendez-vous » (primaire, cacao) + numéro cliquable. Bas droit : pastille « Ouvert · jusqu'à 18h30 » calculée en direct. Arches concentriques sable et ciseaux filaires en parallaxe derrière et devant. Nav en haut avec le même bouton.

FORM: poster à objet central (un seul miroir, vu une fois) puis défilement en scènes : mot-clés tilté, manifeste qui s'allume au scroll, rendez-vous pinné en 4 étapes dans un miroir, prestations en rail horizontal, boutique avec projecteur sur les flacons, chiffres en compteurs à rouleaux dans une phrase, galerie en colonnes parallaxe, avis en paquet de cartes à glisser, appel final sombre, carte en cadre miroir, pied de page à lettres géantes. seed: none (pinned) — « Chaleureux et professionnel », « Crème, beige et blanc », « Loader + Hero immersif plein écran (titre géant animé, accroche, bouton d'action principal, parallax) ».

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Suivi de fin de chantier
- Détecteur : restent « cramped-padding » (sections pleine largeur, retrait assuré par .container, faux positifs vérifiés à l'écran), « nested-cards » (le cadre de miroir contient sa vitre) et « cream-palette » (crème imposée par le brief).
- Plafond connu : cadre argenté dessiné en CSS ; une texture dérivée de la photo des vrais cadres serait plus fidèle.

## Décisions ouvertes
- Prestations génériques (pas de liste fournie) à valider par le salon.
- Compteurs dérivés des horaires et des avis (45,5 h, 15+ ans, dès 1 an, 4 routines) : à remplacer par les chiffres réels du salon si disponibles.
- Mentions légales et nom de domaine à fournir.

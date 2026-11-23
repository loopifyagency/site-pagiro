---
name: Pagiro
description: Salon de coiffure mixte à Brest, vu à travers un miroir argenté : crème, beige et blanc, une touche d'orchidée.
colors:
  creme: "#F4ECDF"
  nacre: "#FFFDF8"
  lin: "#E6D6BD"
  sable: "#BE9F78"
  argent: "#C4BEB2"
  cacao: "#2A1C17"
  muted: "#5F4B3B"
  orchidee: "#7A3C8A"
typography:
  display-hero:
    fontFamily: "Bricolage Grotesque, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(5.4rem, 19vw, 21rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 6.2vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.2vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1.5vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, Avenir Next, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  glass: "6px"
  md: "14px"
  lg: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4.2vw, 3.5rem)"
  section: "clamp(5.5rem, 11vw, 10rem)"
  header: "4.5rem"
components:
  button-primary:
    backgroundColor: "{colors.cacao}"
    textColor: "{colors.creme}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.85em 1.75em"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.sable}"
    textColor: "{colors.cacao}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cacao}"
    rounded: "{rounded.pill}"
    padding: "0.85em 1.75em"
  status-pill:
    backgroundColor: "{colors.nacre}"
    textColor: "{colors.cacao}"
    rounded: "{rounded.pill}"
    padding: "0.5em 1em"
  service-panel:
    backgroundColor: "{colors.nacre}"
    textColor: "{colors.cacao}"
    rounded: "{rounded.lg}"
    padding: "2rem"
  service-panel-cacao:
    backgroundColor: "{colors.cacao}"
    textColor: "{colors.creme}"
  review-card:
    backgroundColor: "{colors.nacre}"
    textColor: "{colors.cacao}"
    rounded: "{rounded.lg}"
    padding: "2.8rem"
---

# Design System: Pagiro

## Overview

**Creative North Star: « Le Miroir »**

Pagiro est un salon lumineux aux miroirs encadrés d'argent, aux fauteuils violets translucides, sous une lumière chaude. Le site le montre comme le salon le fait : chaque image clé est vue à travers un miroir en arche, traversé par un reflet qui balaie la vitre. Le miroir est le cadre, la ligne de coupe en pointillés (où voyage une paire de ciseaux dessinés) est le séparateur, l'arche est la forme.

Le système est chaleureux et professionnel : de grands aplats crème, blanc nacré et beige lin, du cacao pour le texte et les sections sombres, de l'argent froid pour les cadres. L'orchidée, tirée des chaises, ne vit que dans les détails qui bougent ou qui guident.

**Key Characteristics:**
- Grands aplats de crème, nacre et lin qui alternent par section ; deux blocs sombres (appel final, pied de page) pour ponctuer.
- Cadres de miroir en arche à perlage, réservés aux images clés (hero, rendez-vous, boutique, carte).
- Titres en Bricolage Grotesque très contrastés (800 en géant, 300 pour l'emphase), texte en Hanken Grotesk.
- Mouvement comme matière : masques qui montent, rideaux, rouleaux de chiffres, reflets ; jamais une même animation deux sections de suite.

## Colors

Palette de sept rôles, tous évidencés dans `assets/css/style.css` (`:root`).

### Primary
- **Cacao** (`#2A1C17`) : texte, boutons principaux, sections sombres (appel final, pied de page, menu mobile). 14:1 sur crème.

### Secondary
- **Sable doré** (`#BE9F78`) : filets, pointillés de coupe, remplissage au survol des boutons, mot d'emphase sur fond cacao. Jamais pour du texte courant sur clair.
- **Argent** (`#C4BEB2`) : ton moyen du cadre de miroir (le cadre est un dégradé froid de cette famille).

### Tertiary
- **Orchidée** (`#7A3C8A`) : la touche signature. Numéros d'étapes, chiffres des compteurs, projecteur de la boutique, anneau de focus, ligne de progression, jour courant dans les horaires. 5,2:1 minimum sur les fonds clairs.

### Neutral
- **Crème** (`#F4ECDF`) : fond principal.
- **Blanc nacré** (`#FFFDF8`) : surfaces claires (cartes, pastilles, section boutique), reflets.
- **Beige lin** (`#E6D6BD`) : grands aplats (rendez-vous, chiffres, avis), rideaux de révélation.
- **Muted** (`#5F4B3B`) : texte secondaire, 5,8:1 sur lin, 7:1 sur crème.

### Named Rules
**The Orchid Touch Rule.** L'orchidée occupe moins de 3 % de l'écran et ne porte jamais de grande surface ni un bouton principal.
**The Cream Is Pinned Rule.** Le crème, le beige et le blanc sont imposés par le propriétaire ; la variation vient des aplats de lin, de nacre et de cacao, pas d'un nouvel accent.
**The Cool Silver Rule.** L'argent des cadres reste froid pour contraster avec la chaleur du beige.

## Typography

**Display Font:** Bricolage Grotesque (auto-hébergée, `assets/fonts/`)
**Body Font:** Hanken Grotesk (auto-hébergée)

**Character:** une grotesque humaniste aux terminaisons vivantes, qui fait écho à l'enseigne géométrique de la façade et à l'emballage coloré des produits, plus chaleureuse qu'une géométrique froide.

### Hierarchy
- **Display** (800, `clamp(5.4rem, 19vw, 21rem)`, 0.82, -0.04em) : le mot « Pagiro » du hero, celui du préchargeur et du pied de page. Seuls endroits au-delà de 6rem avec le titre de l'appel final.
- **Headline** (700, `clamp(2.6rem, 6.2vw, 6rem)`, 1, -0.03em) : titres de section ; le mot d'emphase passe en 300 (`em`), l'emphase vient du poids.
- **Title** (700, `clamp(1.6rem, 2.2vw, 2.1rem)`) : titres de panneaux et d'étapes.
- **Body** (400, 1.0625rem, 1.65) : texte, mesure bornée à 34–40 rem.
- **Label** (600, 1rem) : boutons, pastilles, légendes.

### Named Rules
**The Weight Contrast Rule.** Pas d'italique synthétique ni de dégradé dans le texte : l'emphase est un saut de poids (700→300) ou de taille.
**The Tabular Numbers Rule.** Horaires, compteurs et numéros de téléphone utilisent des chiffres tabulaires.

## Layout

Conteneur de 1320 px plus des gouttières fluides (`--gutter`), rythme vertical `--section` (5,5 à 10 rem). L'espace est plus grand au-dessus d'un titre qu'en dessous. Les sections alternent crème, lin, nacre ; chacune a sa propre composition : poster à objet central (hero), manifeste à texte qui s'allume, scène pinnée en deux colonnes (rendez-vous), rail horizontal (prestations), deux colonnes avec projecteur (boutique), phrase typographique (chiffres), trois colonnes à vitesses différentes (galerie), paquet de cartes (avis), appel plein cadre, carte en cadre (accès).

Responsive : le hero s'empile sous 900 px (miroir, mot qui le traverse, texte). Sous 900 px, la scène pinnée devient une pile d'étapes avec photo, le rail horizontal un défilement tactile à accroche, la galerie une ou deux colonnes, et un bouton « Appeler » flottant apparaît. Les animations lourdes (parallaxe, pin, tilt) sont retirées ; `prefers-reduced-motion` retire aussi le préchargeur et le smooth scroll.

## Elevation & Depth

Une seule ombre, portée par l'objet « miroir » : `0 2.4rem 3rem -1.6rem rgba(42, 28, 23, .4)`, douce et décalée vers le bas. Les panneaux, cartes d'avis et pastilles n'ont qu'un filet de 1 px en sable à 55 %, jamais d'ombre en plus.

### Named Rules
**The One Shadow Rule.** L'élévation se déclare une fois : ombre pour le miroir, filet pour tout le reste.

## Shapes

- **Arche** : `border-radius: 50% 50% 14px 14px / calc(50% * var(--ar)) …` ; la forme du miroir, du manifeste et de la section « rendez-vous » (haut en arche).
- **Panneaux et cartes** : 16 px ; images de galerie 14 px ; vitre du miroir 6–8 px.
- **Pilule** (999 px) : boutons, pastilles de statut, sélecteur de routine, étiquettes de galerie.
- **Pointillés de coupe** : trait 2 px en tirets (`border-top: 2px dashed`) pour les séparateurs, la progression du préchargeur et du rail.

## Components

### Buttons
- **Shape:** pilule, hauteur 3,25 rem (2,75 rem en en-tête).
- **Primary:** fond cacao, texte crème ; au survol, un remplissage sable monte du bas (`::before`, transform seul) et le texte passe en cacao. Les boutons principaux sont magnétiques (attirés par le curseur) sur pointeur fin.
- **Ghost:** même pilule, filet cacao, fond transparent.
- **Light:** crème sur fond sombre (menu mobile).

### Chips
- Sélecteur de routine : pilule à filet cacao ; l'état actif se remplit de cacao. Pastille de statut : fond nacre, point vert (ouvert) ou gris (fermé), calculée à l'heure de Paris.

### Cards / Containers
- **Panneau de prestation :** 16 px, filet sable, variantes nacre, lin et cacao, hauteurs alternées (haut/court) ; art au trait (stroke 1,1 sur viewBox 48) qui se dessine à l'entrée ; inclinaison 3D et reflet qui suit la souris.
- **Carte d'avis :** nacre, filet sable, guillemet orchidée ; empilée, glissable, hauteur du paquet = hauteur de la carte active.
- **Dernier panneau :** coupon à pointillés sable (« Votre tour ? »).

### Inputs / Fields
Aucun champ : la réservation passe par Planity ou le téléphone.

### Navigation
En-tête fixe qui se masque au scroll vers le bas et réapparaît vers le haut ; liens à soulignement qui glisse (`scaleX`). Sous 900 px, bouton rond et menu plein écran cacao aux liens qui montent en cascade.

### Signature Component: le Miroir
Cadre argenté perlé en arche (dégradé froid, perlage en points, filets clair/foncé), vitre qui contient l'image avec parallaxe interne, reflet diagonal qui la balaie (au chargement, au survol, à l'entrée), rideau de révélation qui monte. Variantes : arche (hero, rendez-vous), paysage (boutique), carte.

## Do's and Don'ts

### Do:
- **Do** garder crème, nacre et lin en grands aplats, et réserver l'orchidée aux détails vivants.
- **Do** montrer les images clés dans un miroir (cadre + reflet) et les autres en arche ou en 14 px sans cadre.
- **Do** animer `transform` et `opacity` (les masques `clip-path` pour les révélations), en courbes expo/power, avec décalage entre éléments, et prévoir la version sans mouvement.
- **Do** écrire les textes à partir de ce que prouvent les avis, les photos et les horaires, et renvoyer les tarifs vers Planity.

### Don't:
- **Don't** mettre un surtitre (eyebrow) au-dessus d'un titre, ni de dégradé dans le texte, ni d'ombre dure décalée.
- **Don't** utiliser un glyphe Unicode comme icône : les icônes sont des SVG au trait.
- **Don't** ajouter du grain `feTurbulence` ni de rayures répétées en fond.
- **Don't** inventer de chiffres, de tarifs ou d'avis ; les compteurs viennent des horaires, des avis et des produits visibles, et sont signalés comme tels.
- **Don't** descendre sous -0,04 em d'espacement de lettres.

**Not canonized (défauts connus du build) :** le cadre argenté est dessiné en CSS (dégradé + perlage) alors que les vrais cadres sont photographiés ; une texture dérivée de la photo serait plus fidèle. Le détecteur signale en outre « cramped-padding » sur des sections pleine largeur dont le retrait est assuré par `.container` (faux positifs vérifiés à l'écran), et la crème imposée par le brief.

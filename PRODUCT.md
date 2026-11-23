# Product

<!-- impeccable:product-schema 1 -->

> Rédigé à partir du brief fourni par le propriétaire du projet, sans interview (le brief couvre public, action principale, contraintes et preuves). Les faits marqués « déduit » sont des hypothèses à confirmer.

## Platform

web

## Stack

Délégué : HTML/CSS/JS statique, sans étape de build, déployable sur n'importe quel hébergement statique. GSAP + ScrollTrigger + Lenis embarqués localement (`assets/vendor/`), polices Google Fonts auto-hébergées (`assets/fonts/`, pas de requête vers Google, plus simple côté RGPD). Déduit : le brief demande un site vitrine de salon local, rien n'impose de framework.

## Users

Habitants de Brest et alentours qui cherchent un coiffeur : femmes, hommes, familles avec enfants (un client y a coiffé son fils d'un an), clients fidèles (l'un fréquente le salon « depuis plus de 15 ans »). Situation type : sur mobile, ils veulent vérifier le sérieux du salon, les horaires, l'adresse, puis réserver ou appeler.

## Product Purpose

Site vitrine du salon Pagiro. Action principale attendue : **prendre rendez-vous** (réservation en ligne sur Planity ou appel téléphonique). Succès : un visiteur réserve ou appelle ; sinon il retient l'adresse et les horaires.

## Positioning

Salon de coiffure **mixte** (enseigne : « Coiffure mixte ») à taille humaine : une patronne et une employée selon les avis, écoute et conseil, travail soigné, fauteuil massant au shampoing, accueil des enfants. Cadre reconnaissable sur les photos : miroirs aux cadres argentés ornés, éclairage chaud, fauteuils en acrylique violet, suspensions violettes.

## Operating Context

- Nom : Pagiro
- Adresse : 2 Rue Algésiras, 29200 Brest
- Téléphone : 02 98 44 23 66 (`tel:+33298442366`)
- Réservation en ligne : https://www.planity.com/pagiro-29200-brest (seul réseau / lien externe fourni)
- Google Maps : https://maps.app.goo.gl/P1gsYH3jDUF8R9uu5
- Horaires : lundi 9h30–18h30 · mardi 8h30–18h30 · mercredi fermé · jeudi 8h30–18h30 · vendredi 8h30–18h30 · samedi 8h30–15h · dimanche fermé
- Produits visibles en salon : gamme Eleven Australia (I Want Body, Hydrate My Hair, Repair My Hair, Smooth Me Now), Lakmé Teknia, affiche lift'hair.

## Capabilities and Constraints

- Langue du site : français.
- Aucun tarif fourni : ne pas en inventer, renvoyer vers Planity.
- Liste détaillée des prestations non fournie : les prestations affichées sont génériques pour un salon mixte (déduit), à valider par le salon.
- Pas de noms d'équipe, pas de nombre de clients, pas d'ancienneté officielle, pas de note moyenne : ne pas en inventer.
- Pas de domaine ni de mentions légales fournis (SIRET, hébergeur) : à ajouter par le propriétaire.

## Brand Commitments

- Ambiance imposée : chaleureux et professionnel.
- Couleurs imposées : crème, beige et blanc.

## Evidence on Hand

- 5 avis clients réels, à reprendre mot pour mot (Marine Paris, Marc-Anthony Zoubiri, Nathalie A, Jean Louis Layec, Gaëtan Le Duff). Aucun avis à inventer, aucune note chiffrée fournie.
- 5 photos (`assets/img/`) : produits Eleven Australia, trois vues de l'intérieur (miroirs et fauteuils), façade avec enseigne « PAGIRO » et vitrine « Coiffure mixte ».
- Absences à respecter : pas de photos de l'équipe, pas de vidéo, pas de logo vectoriel.

## Product Principles

1. Réserver doit être possible à tout moment du parcours : un appel à l'action visible en permanence, sans jamais être insistant.
2. Dire uniquement ce que les avis, les photos et les horaires prouvent ; renvoyer vers Planity pour tout le reste (tarifs, créneaux).
3. L'ambiance du salon (miroirs, lumière chaude, fauteuils violets) est la preuve la plus forte : la montrer plutôt que la décrire.
4. Rapide et lisible sur mobile : la majorité des visiteurs locaux arrivent depuis un téléphone.

## Accessibility & Inclusion

Contrastes AA, navigation clavier complète, textes alternatifs, `prefers-reduced-motion` respecté (version sans smooth scroll ni pin), cibles tactiles ≥ 44 px.

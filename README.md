# Pagiro — site vitrine

Salon de coiffure mixte, 2 rue d'Algésiras, 29200 Brest. Site statique (HTML, CSS, JS), sans étape de build.

## Voir le site

N'importe quel serveur statique convient :

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000. Le dossier peut être déposé tel quel chez un hébergeur statique (Netlify, Vercel, GitHub Pages, OVH…).

## Mise en ligne (GitHub Pages)

Le site est publié par le workflow `.github/workflows/pages.yml` à chaque mise à jour de `main` (et à la demande, via l'onglet Actions → « Déploiement GitHub Pages » → Run workflow). Seuls `index.html` et `assets/` sont publiés.

À faire une seule fois, dans le dépôt GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Adresse du site : https://loopifyagency.github.io/site-pagiro/

Tous les chemins du site sont relatifs, il fonctionne donc aussi bien dans ce sous-dossier que sur un nom de domaine propre (Settings → Pages → Custom domain).

## Structure

```
index.html              contenu, données structurées (LocalBusiness), sprite d'icônes
assets/css/style.css    tout le style (jetons dans :root)
assets/js/main.js       préchargeur, animations, carrousel d'avis, horaires en direct
assets/vendor/          GSAP 3.15 + ScrollTrigger, Lenis 1.3 (copies locales)
assets/fonts/           Bricolage Grotesque + Hanken Grotesk (auto-hébergées)
assets/img/             photos du salon et recadrages de détails
PRODUCT.md, DESIGN.md   contexte produit et système de design (Impeccable)
```

## À modifier quand le salon change

- **Horaires** : trois endroits à garder cohérents — le tableau de la section « Nous trouver » (`index.html`), l'objet `SCHEDULE` en haut de `assets/js/main.js` (pastille « ouvert / fermé »), et `openingHoursSpecification` dans le JSON-LD.
- **Avis** : section `#avis` de `index.html` (texte repris mot pour mot des avis fournis).
- **Prestations** : panneaux de `#prestations` ; aucun tarif n'est affiché, le site renvoie vers Planity.
- **Chiffres** de la section « une phrase, des compteurs » : `data-odo` dans `index.html` (valeurs dérivées des horaires, des avis et des produits visibles en photo).

## Accessibilité et mouvement

Si le visiteur demande moins de mouvement (`prefers-reduced-motion`), il n'y a ni préchargeur, ni smooth scroll, ni section pinnée ; les mêmes contenus s'affichent en mise en page simple. Sous 900 px, les animations lourdes sont remplacées par des révélations légères et un rail tactile.

## Reste à fournir

- Nom de domaine (pour `canonical`, `og:image` et les images du JSON-LD).
- Mentions légales (raison sociale, SIRET, hébergeur) : non fournies, donc non rédigées.
- Validation de la liste des prestations (rédigée de façon générique pour un salon mixte).

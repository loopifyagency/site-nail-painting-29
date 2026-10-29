# Nailpainting29 · site vitrine

Site d'une page pour **Nailpainting29 Prothésiste ongulaire** (rue Clara Machtou, 29200 Brest). Objectif : faire prendre rendez-vous par téléphone ou par SMS au **06 78 99 20 03**.

HTML, CSS et JavaScript statiques, sans étape de build. GSAP, ScrollTrigger et Lenis sont embarqués dans le dépôt (`assets/js/vendor/`), les polices aussi (`assets/fonts/`) : aucune dépendance à un CDN, donc pas de requête vers Google Fonts côté visiteur.

## Voir le site en local

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000. N'importe quel hébergement statique convient (GitHub Pages, Netlify, OVH…) : il suffit de publier `index.html` et le dossier `assets/`. Les dossiers `.claude/` et `.impeccable/` sont des notes de travail (GitHub Pages les ignore déjà) : inutile de les publier ailleurs.

## Structure

```
index.html              page unique, données structurées LocalBusiness incluses
assets/css/style.css    tout le style (variables de la charte en tête de fichier)
assets/js/main.js       statut d'ouverture, menu, composeur de set, carrousel d'avis, animations
assets/js/vendor/       GSAP 3.12.7 + ScrollTrigger, Lenis 1.1.20
assets/img/             les 5 photos fournies
assets/fonts/           Gloock (titres) et Figtree (texte)
PRODUCT.md, DESIGN.md   contexte produit et système visuel
```

## Direction artistique : « La pose »

Le site est un ongle en train d'être peint : trait de vernis épais et brillant, photos en forme d'ongle, quatre laques imposées (`#A8F990`, `#A0E5FA`, `#FE672E`, `#F9EA4F`) sur un fond blanc laqué. Le détail des règles est dans `DESIGN.md`.

## Modifier le contenu

- **Téléphone** : chercher `+33678992003` et `06 78 99 20 03` dans `index.html` et `assets/js/main.js` (constante `PHONE`).
- **Horaires** : tableau `.hours` dans `index.html` (section « Chez Laurie, à Brest »), la ligne du jour s'allume toute seule ; le statut « Ouvert maintenant » est calculé dans `initOpenStatus()` de `assets/js/main.js` et dans les données structurées en tête de `index.html`.
- **Avis** : liste `.reviews__track` dans `index.html`, texte repris mot pour mot.
- **Photos** : remplacer les fichiers de `assets/img/` en gardant les noms (ou adapter les `src`). Les photos fournies sont petites (224 à 600 px de large) : des originaux en haute résolution rendront nettement mieux.
- **Couleurs et polices** : variables `:root` au début de `assets/css/style.css`.

## À compléter par le salon

- **Tarifs** : aucun prix n'a été fourni, les cartes indiquent « Tarif sur demande ».
- **Réseaux sociaux** : aucun lien fourni, aucun lien affiché.
- **Horaires du dimanche** : seule la ligne « dimanche (Toussaint), fermé » a été fournie ; à confirmer pour les autres dimanches.
- **Descriptions des prestations** : écrites d'après les photos et les avis ; à relire.
- **Nom de domaine** : une fois connu, ajouter `canonical`, `og:url`, `og:image` et `url` dans les données structurées.

## Accessibilité, performance, mouvement

- Contrastes vérifiés (texte aubergine sur les quatre laques), navigation au clavier, lien d'évitement, textes alternatifs, carrousel avec précédent / suivant / pause, zéro violation axe-core.
- Poids : environ 130 Ko de bibliothèques JavaScript, 46 Ko de polices, 300 Ko d'images ; images en `loading="lazy"` hors du premier écran.
- `prefers-reduced-motion` : pas de préchargeur, pas de défilement lissé, pas de sections pinnées, apparitions en fondu.
- Si GSAP n'est pas chargé ou si JavaScript est désactivé, tout le contenu reste visible.

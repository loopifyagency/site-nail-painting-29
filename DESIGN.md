---
name: Nailpainting29
description: Un salon de manucure peint au vernis : traits épais et brillants, photos en forme d'ongle, quatre couleurs de laque sur un fond blanc laqué.
colors:
  lacquer-white: "#F4FBFD"
  blush-nude: "#F3DDD3"
  aubergine-ink: "#2B1426"
  mauve-ink: "#5E4455"
  mint-lacquer: "#A8F990"
  sky-lacquer: "#A0E5FA"
  mandarin-lacquer: "#FE672E"
  lemon-lacquer: "#F9EA4F"
typography:
  display:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(3.1rem, 9vw, 8.8rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(2.4rem, 6vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(1.7rem, 2.3vw, 2.15rem)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 800
    letterSpacing: "0.06em"
rounded:
  card: "14px"
  panel: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  section: "clamp(5.5rem, 12vw, 11rem)"
  edge: "clamp(28px, 6vw, 92px)"
components:
  button-primary:
    backgroundColor: "{colors.aubergine-ink}"
    textColor: "{colors.lacquer-white}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.mandarin-lacquer}"
    textColor: "{colors.aubergine-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.6rem"
  button-ghost-hover:
    backgroundColor: "{colors.lemon-lacquer}"
  nav-pill:
    backgroundColor: "{colors.lacquer-white}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.55rem 0.5rem 1.15rem"
  service-card:
    backgroundColor: "{colors.mint-lacquer}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.card}"
    padding: "1.1rem 1.1rem 1.5rem"
  review-card:
    backgroundColor: "{colors.lacquer-white}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.panel}"
    padding: "1.9rem 1.8rem 1.6rem"
  option-chip:
    backgroundColor: "transparent"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.15rem"
  option-chip-selected:
    backgroundColor: "{colors.aubergine-ink}"
    textColor: "{colors.lacquer-white}"
---

# Design System: Nailpainting29

## Overview

**Creative North Star: "La pose"**

Le site est un ongle en train d'être peint. Chaque surface, chaque transition, chaque soulignement est un trait de vernis : épais, arrondi, brillant, avec un reflet blanc sur le tiers supérieur et une ombre douce sur le bord bas. Le ton est sophistiqué par la retenue (un fond blanc laqué, une encre aubergine, une seule police d'affichage à fort contraste) et chaleureux et coloré par l'échelle : quatre laques imposées (menthe, ciel, mandarine, citron) occupent des sections entières, pas des touches d'accent.

La page refuse le gabarit du salon de beauté : pas de rose poudré et de fine serif, pas de grille de cartes photo identiques. Les photos ne sont jamais des rectangles : elles vivent dans des cadres en forme d'ongle (carré arrondi, amande, ovale). Les sections se rejoignent par un bord courbe et lumineux, comme le ménisque d'un vernis qui vient d'être posé.

**Key Characteristics:**
- Laque en aplats pleins qui possèdent des sections entières ; texte toujours en encre aubergine sur les quatre laques.
- Reflet blanc (le « gloss ») comme signature répétée : traits, gouttes, boutons, photos, ongles du composeur.
- Cadres photo en forme d'ongle ; aucune photo en rectangle brut.
- Typographie géante pour les moments clés (accroche, numéro de téléphone, nom en pied de page), jamais pour le texte courant.
- Mouvement comme un geste de pose : couche qui monte, rideau qui se lève, trait qui se peint.

## Colors

Une palette de sept rôles : deux fonds, deux encres, quatre laques. Les quatre laques sont imposées par le client et ne changent jamais de valeur.

### Primary
- **Laque mandarine** (#FE672E) : le champ le plus chaud de la page. Trait derrière « qui sourient. », 4e couche du rituel, section d'appel, bouton flottant. Fond uniquement ; jamais en texte sur fond clair (contraste 2,7:1), toujours avec de l'encre aubergine dessus (5,8:1).

### Secondary
- **Laque menthe** (#A8F990) : 2e couche du rituel, carte « La pose », avatar, marqueur « 10 h ».
- **Laque ciel** (#A0E5FA) : 1re couche du rituel, section des chiffres, bande de marquee croisée, carte « La French colorée ».
- **Laque citron** (#F9EA4F) : 3e couche du rituel, bande de marquee, section des avis, ligne du jour dans les horaires.

### Neutral
- **Blanc laqué** (#F4FBFD) : fond de page (hero, composeur, « nous trouver »), légèrement teinté du ciel. Choisi à la place d'un crème chaud, jugé le réflexe par défaut du secteur.
- **Nude rosé** (#F3DDD3) : fond de la galerie, panneau du composeur, cartes « Ongles rongés », rangées d'horaires. C'est ici que vit la chaleur de peau.
- **Encre aubergine** (#2B1426) : texte, sections sombres (prestations, pied de page), contour des boutons.
- **Encre mauve** (#5E4455) : texte secondaire sur fonds clairs (6,6:1 sur le nude).

### Named Rules
**The Ink-On-Lacquer Rule.** Sur chacune des quatre laques, le texte est en encre aubergine, jamais blanc. Le blanc sur la mandarine échoue au contraste.

**The Lacquer Field Rule.** Une laque occupe une section ou une bande entière, jamais un simple filet ou un badge perdu sur un fond neutre.

## Typography

**Display Font:** Gloock (repli Times New Roman)
**Body Font:** Figtree (repli system-ui)

**Character:** Gloock est une serif à fort contraste dont les terminaisons restent douces, comme une goutte de vernis ; Figtree est sa contrepartie lisible, ronde et chaleureuse. Les deux sont auto-hébergées (woff2, sous-ensemble latin).

### Hierarchy
- **Display** (400, clamp(3.1rem, 9vw, 8.8rem), 0.94) : l'accroche du hero uniquement. Calée sur deux lignes, la seconde posée sur le trait mandarine.
- **Headline** (400, clamp(2.4rem, 6vw, 5.5rem), 1) : titres de section, 17 caractères de large au maximum.
- **Title** (400, clamp(1.7rem, 2.3vw, 2.15rem), 1.05) : titres de cartes et d'étapes.
- **Body** (400, 1.0625rem, 1.55) : texte courant, 65 caractères de mesure au plus.
- **Label** (800, 0.86rem, 0.06em, capitales) : légendes de formulaire et prix « sur demande ».

### Named Rules
**The Giant Moment Rule.** Au-dessus de 6rem, la serif n'apparaît que pour l'accroche, le numéro de téléphone, les marqueurs de chiffres et le nom en pied de page. Les titres de section restent sous 5,5rem.

**The Tabular Numbers Rule.** Compteurs, horaires et statut d'ouverture utilisent des chiffres tabulaires pour ne pas trembler en comptant.

## Layout

Une seule colonne de sections pleine largeur, chacune posée sur sa propre laque, avec un conteneur de lecture de 82rem et une gouttière fluide (1,25 à 3,5rem). L'espacement vertical des sections est fluide (5,5 à 11rem) et toujours supérieur à la hauteur du bord courbe de la section suivante.

Les compositions changent d'une section à l'autre : accroche asymétrique avec collage de photos (hero), bandes croisées (marquee), section pinnée en deux colonnes (rituel), rail horizontal piloté par le scroll (prestations), phrases décalées en zigzag (chiffres), composeur à scène collante (ton set), grille décalée de cadres (galerie), carrousel de cartes (avis), numéro centré (appel), deux colonnes informations/carte (contact). Sous 900px, le rituel se déroule en bandes empilées, le rail devient un défilement horizontal natif et la scène du composeur reste collée en haut pendant les choix.

## Elevation & Depth

Hybride : les aplats sont plats, la profondeur vient des reflets et d'ombres douces avec décalage. Les photos en forme d'ongle portent une ombre portée (`filter: drop-shadow(0 18px 20px rgba(43,20,38,.22))`) posée sur un conteneur parent, parce que le `clip-path` couperait un `box-shadow`. Les traits et boutons gagnent leur relief par deux ombres internes (reflet clair en haut, ombre douce en bas).

### Shadow Vocabulary
- **Photo portée** (`filter: drop-shadow(0 18px 20px rgba(43,20,38,.22))`) : cadres photo.
- **Carte d'avis** (`0 22px 30px -22px rgba(43,20,38,.5)`) : cartes du carrousel.
- **Pilule de navigation** (`0 12px 28px -14px rgba(43,20,38,.4)`) : barre flottante.
- **Relief de laque** (`inset 0 -0.22em 0.35em -0.1em rgba(43,20,38,.16)`) : traits, marqueurs, gouttes.

### Named Rules
**The Gloss Rule.** Toute forme de laque porte un reflet blanc translucide sur son tiers supérieur. Une laque sans reflet est un aplat de CSS, pas du vernis.

**The Meniscus Edge Rule.** Chaque section après le hero rencontre la précédente par un bord courbe (`border-radius: 50% 50% 0 0 / 100% 100% 0 0`) surligné d'un filet blanc de 3px, qui monte au scroll.

## Shapes

Le langage de formes est celui d'un ongle : arrondi, sans angle vif. Trois cadres de photo : carré arrondi (squoval), amande, ovale, dessinés en `clipPath` SVG en unités relatives. Les boutons et puces sont des pilules ; les cartes ont 14 à 16px de rayon. Les gouttes sont des gouttes de vernis (carré à trois coins arrondis, pointe vers le haut). Deux charmes géométriques, l'étoile à quatre branches et le nœud, rappellent les motifs de nail art des photos.

### Named Rules
**The Nail Frame Rule.** Une photo n'apparaît que dans un cadre en forme d'ongle. Pas de rectangle à coins vifs, pas de cercle.

## Components

### Buttons
- **Shape:** pilule complète (999px).
- **Primary:** fond aubergine, texte blanc laqué, 0.95rem × 1.6rem ; au survol, une vague de laque mandarine monte depuis le bas avec un bord courbe et le texte passe en aubergine.
- **Ghost:** transparent, contour aubergine 2px ; la vague est citron.
- **Magnétique:** sur pointeur fin, le bouton suit le curseur (30 % en x, 40 % en y) avec un rappel élastique ; l'étiquette bouge de 12 %.
- **Focus:** contour plein de 3px en encre (en citron sur les fonds sombres), décalé de 3px.

### Navigation
Pilule flottante blanc laqué (74rem max) : logo goutte + nom, liens à soulignement mandarine qui se peint, bouton Appeler. Elle se cache en descendant et revient en remontant. Sous 1100px : burger rond, menu plein écran aubergine qui s'ouvre en cercle depuis le bouton, liens en serif 4,2rem.

### Cartes de prestation
Largeur 20rem, rayon 14px, une laque différente par carte, décalage vertical propre à chacune. Cadre photo en forme d'ongle en tête, titre en serif, texte, « Tarif sur demande » en capitales. Inclinaison 3D (±7°) avec reflet blanc qui suit le pointeur.

### Cartes d'avis
Blanc laqué, rayon 16px, grand guillemet mandarine, texte en serif, avatar initial sur une laque. La carte centrée est nette, les autres réduites à 95 % et à 62 % d'opacité.

### Composeur de set
Cinq ongles géométriques (pas de main dessinée) posés sur un disque blanc cerclé de la teinte choisie. Forme, teinte et motif se choisissent par puces et pastilles ; le changement de teinte repeint chaque ongle par une couche qui monte, l'un après l'autre.

## Do's and Don'ts

### Do:
- **Do** poser le texte en encre aubergine (#2B1426) sur chacune des quatre laques.
- **Do** donner un reflet blanc à toute forme de laque (traits, gouttes, boutons, ongles).
- **Do** garder les photos dans des cadres en forme d'ongle.
- **Do** faire varier la composition et l'animation de chaque section : une seule idée de mouvement par section.
- **Do** laisser le contenu visible par défaut et réserver les états masqués à JavaScript ; prévoir la variante `prefers-reduced-motion`.

### Don't:
- **Don't** mettre du blanc sur la laque mandarine, ni de la mandarine en texte sur fond clair.
- **Don't** ajouter un surtitre au-dessus d'un titre de section.
- **Don't** dessiner de main, de visage ou de scène : seules des formes géométriques (ongles, gouttes, étoile, nœud).
- **Don't** inventer de prix, de chiffres ou de réseaux sociaux : ce qui n'est pas fourni est omis ou marqué « sur demande ».
- **Don't** reprendre un fond crème et une serif fine : c'est le réflexe du secteur.

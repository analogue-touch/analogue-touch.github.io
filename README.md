# Analogue Touch

Le site d'Analogue Touch : des plugins gratuits refaits d'après des machines analogiques, avec l'IA. Bêta.

Le site est une régie de studio en pixel art. On s'y déplace en cliquant sur les machines : la caméra va jusqu'à elles, et le carnet de travail, posé sur la desserte, garde l'installation, la méthode et le journal.

## Le voir en local

Dans ce dossier :

```
python -m http.server 8000
```

puis ouvrir http://127.0.0.1:8000.

## Comment il est fait

Une seule page, sans dépendance. La scène est dessinée par des programmes (une pièce posée en 3D puis projetée, en 960 × 540) ; les voyages de la caméra sont des images rendues d'avance. `dc-autonome.js` relie le balisage de la page à ses valeurs.

Fait par Touf. Le code et les images sont faits avec Claude, une IA ; Touf écoute le son et relit les textes.

Les machines d'origine appartiennent à leurs fabricants. Aucun lien avec eux.

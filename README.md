# Phrasor

Application React + TypeScript + Vite pour générer des propositions élémentaires françaises à partir de formules abstraites.

## Fonctionnalités principales
- Éditeur de formules avec validation stricte (tokens D, N, V, A, ADV, P, C).
- Génération automatique de propositions élémentaires avec remplissage lexical aléatoire.
- Slots verrouillables, correction grammaticale automatique activable/désactivable par slot.
- Accord français (déterminants, noms, verbes, adjectifs) et conjugaison locale.
- Lexiques CSV embarqués, sans saisie libre.
- Assemblage d’un signe propositionnel avec connecteurs issus du lexique.
- Persistance locale IndexedDB via Dexie et état Zustand.

## Scripts
- `npm install` pour installer les dépendances.
- `npm run dev` lance Vite en mode développement.
- `npm run build` vérifie le typage TypeScript puis construit l’application.

## Structure
- `src/types` : modèles de données imposés.
- `src/engine` : parsing de formules, accords, génération et validation.
- `src/store` : stores Zustand connectés à IndexedDB.
- `src/data/lexicons` : lexiques CSV (noms, verbes, adjectifs, déterminants, connecteurs).
- `src/ui` : composants d’édition et de rendu (formules, propositions, slots, final).

Aucun backend ou appel cloud n’est nécessaire : tout fonctionne hors ligne.

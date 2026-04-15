# Depuis

Application mobile qui affiche le temps écoulé depuis des dates définies par l'utilisateur.

- Ajoute des minuteurs avec un libellé, une date/heure et une couleur pastel
- Modifier, supprimer, réordonner les minuteurs
- Données persistées localement (AsyncStorage)
- Interface en français et en anglais
- Aucun backend — fonctionne entièrement hors ligne

---

## Prérequis

- [Node.js](https://nodejs.org/) 18 ou supérieur
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- [EAS CLI](https://docs.expo.dev/eas/) pour les builds Android :
  ```bash
  npm install -g eas-cli
  eas login
  ```

---

## Installation

Cloner le repo puis se placer dans le dossier de l'app :

```bash
git clone https://github.com/NicoSab44/depuis.git
cd depuis/artifacts/time-case
npm install
```

> **Important (Windows)** : rester dans `artifacts/time-case` pour l'installation. Ne pas lancer `npm install` à la racine du repo — ce dossier est un monorepo pnpm qui n'est pas nécessaire pour builder l'app.

---

## Commandes disponibles

### Développement

| Commande | Description |
|---|---|
| `npm start` | Lance le serveur Expo (QR code pour tester sur téléphone) |
| `npm run web` | Exporte le site web statique puis le sert localement |
| `npm test` | Lance les tests unitaires (44 tests, 96% de couverture) |
| `npm run typecheck` | Vérifie les types TypeScript |

### Build Android

| Commande | Description |
|---|---|
| `npm run android:preview` | APK non signé pour test interne |
| `npm run android:build` | AAB pour le Play Store (signature EAS par défaut) |
| `npm run android:build:signed` | AAB signé — EAS gère le keystore *(recommandé)* |
| `npm run android:build:signed:local` | AAB signé avec ton propre keystore local |
| `npm run android:preview:signed` | APK signé pour distribution interne |
| `npm run android:keystore:generate` | Assistant pour créer ou importer un keystore |
| `npm run android:submit` | Soumet le build sur le Play Store (piste `internal`) |

---

## Build et signature Android

### Option 1 — Keystore géré par EAS (le plus simple)

EAS Cloud crée et stocke le keystore pour toi :

```bash
npm run android:keystore:generate  # à faire une seule fois
npm run android:build:signed
```

Le build prend environ 10 à 15 minutes. Tu reçois un lien de téléchargement à la fin.

### Option 2 — Keystore local (tu gères ta propre clé)

1. Crée un keystore si tu n'en as pas :
   ```bash
   keytool -genkeypair -v -keystore depuis.keystore -alias depuis \
     -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Copie le fichier exemple et remplis-le :
   ```bash
   cp credentials.json.example credentials.json
   ```

   ```json
   {
     "android": {
       "keystore": {
         "keystorePath": "./depuis.keystore",
         "keystorePassword": "TON_MOT_DE_PASSE_KEYSTORE",
         "keyAlias": "depuis",
         "keyPassword": "TON_MOT_DE_PASSE_CLE"
       }
     }
   }
   ```

3. Lance le build :
   ```bash
   npm run android:build:signed:local
   ```

> `credentials.json` et `*.keystore` sont dans le `.gitignore` — ils ne seront jamais poussés sur GitHub.

---

## Soumission sur le Play Store

1. Crée un compte [Google Play Console](https://play.google.com/console)
2. Télécharge le fichier `google-service-account.json` depuis la console Google Play
3. Place-le à la racine de `artifacts/time-case/`
4. Lance :
   ```bash
   npm run android:submit
   ```

---

## Structure du projet

```
artifacts/time-case/
├── app/                    # Écrans (Expo Router)
├── components/             # Composants réutilisables
│   └── TimerCard.tsx       # Carte d'un minuteur
├── constants/
│   └── i18n.ts             # Traductions FR/EN
├── context/
│   └── TimersContext.tsx   # État global des minuteurs
├── utils/
│   └── elapsed.ts          # Calcul du temps écoulé (pur, testable)
├── __tests__/              # Tests unitaires
├── server/
│   └── serve.js            # Serveur statique local pour `npm run web`
├── eas.json                # Profils de build EAS
├── credentials.json.example # Modèle pour la signature locale
└── app.json                # Configuration Expo
```

---

## Données

Les données sont stockées localement sur l'appareil via AsyncStorage :

- `@time_case_timers_v2` — liste des minuteurs
- `@time_case_settings_v1` — préférences (langue)

Aucun compte ni connexion réseau n'est requis.

---

## Tests

```bash
npm test
```

3 suites de tests, 44 tests :
- `elapsed.test.ts` — calcul du temps écoulé (cas limites, fuseaux horaires)
- `i18n.test.ts` — traductions et détection de la langue système
- `timers-context.test.tsx` — CRUD des minuteurs (ajout, modification, suppression, réordonnancement)

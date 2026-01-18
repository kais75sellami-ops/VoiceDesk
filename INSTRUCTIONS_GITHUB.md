# Instructions pour obtenir les installateurs Mac et Windows via GitHub

## Étape 1: Créer un compte GitHub (si tu n'en as pas)
Va sur https://github.com et crée un compte gratuit si tu n'en as pas déjà un.

## Étape 2: Créer un nouveau dépôt sur GitHub
1. Va sur https://github.com/new
2. Nom du dépôt: `VoiceDesk` (ou le nom que tu veux)
3. Laisse le dépôt en Public ou Private selon ton choix
4. NE COCHE PAS "Initialize this repository with a README"
5. Clique sur "Create repository"

## Étape 3: Publier ton code sur GitHub
GitHub va te montrer des instructions. Tu vas utiliser la section "push an existing repository from the command line".

Ouvre le Terminal et exécute ces commandes:

```bash
cd ~/Desktop/VoiceDesk
git remote add origin https://github.com/TON_NOM_UTILISATEUR/VoiceDesk.git
git branch -M main
git push -u origin main
```

Remplace `TON_NOM_UTILISATEUR` par ton vrai nom d'utilisateur GitHub.

## Étape 4: Déclencher la compilation
Une fois le code publié sur GitHub, tu as deux options:

### Option A: Compilation manuelle (recommandé pour la première fois)
1. Va sur ton dépôt GitHub: https://github.com/TON_NOM_UTILISATEUR/VoiceDesk
2. Clique sur l'onglet "Actions" en haut
3. Tu verras le workflow "Build VoiceDesk"
4. Clique sur "Run workflow" (bouton à droite)
5. Clique sur le bouton vert "Run workflow"
6. Attends environ 10-15 minutes que la compilation se termine

### Option B: Créer un tag de version (pour les futures releases)
```bash
cd ~/Desktop/VoiceDesk
git tag v1.0.0
git push origin v1.0.0
```

Cela déclenchera automatiquement la compilation et créera une release avec les fichiers.

## Étape 5: Télécharger les installateurs
Une fois la compilation terminée:

1. Va dans l'onglet "Actions" de ton dépôt GitHub
2. Clique sur la compilation qui vient de se terminer (elle aura une coche verte)
3. En bas de la page, dans la section "Artifacts", tu verras:
   - **VoiceDesk-macOS**: contient le fichier .dmg pour Mac
   - **VoiceDesk-Windows**: contient le fichier .msi et .exe pour Windows
4. Clique sur chaque artifact pour le télécharger
5. Décompresse les fichiers ZIP téléchargés
6. Copie les installateurs dans ton dossier ~/Desktop/Installateur/

## Automatisation future
Une fois que tu as tout configuré, pour créer de nouvelles versions:

1. Fais tes modifications dans le code
2. Commit et push:
```bash
cd ~/Desktop/VoiceDesk
git add .
git commit -m "Description de tes changements"
git push
```

3. Crée un nouveau tag:
```bash
git tag v1.0.1
git push origin v1.0.1
```

4. GitHub Actions va automatiquement compiler pour Mac et Windows et créer une release avec les installateurs.

## Notes importantes
- La première compilation peut prendre 15-20 minutes
- Les compilations suivantes seront plus rapides (5-10 minutes)
- Tu peux voir les logs de compilation en direct dans l'onglet Actions
- Si la compilation échoue, les logs te montreront l'erreur

## Si tu as besoin d'aide
- Documentation GitHub Actions: https://docs.github.com/en/actions
- Documentation Tauri: https://tauri.app/

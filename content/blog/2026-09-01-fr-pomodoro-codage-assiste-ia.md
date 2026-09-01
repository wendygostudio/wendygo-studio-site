---
schemaVersion: 1
title: "Pomodoro pour le codage assisté par IA : un flux de travail avec revue"
description: "Utilisez des intervalles de concentration pour garder le codage assisté par IA vérifiable : limitez la tâche, inspectez les petits changements, faites de vraies pauses et arrêtez-vous à temps."
date: 2026-09-01
slug: pomodoro-codage-assiste-ia
locale: fr
translationKey: ai-assisted-coding-pomodoro-workflow
product: slimeforge
contentType: how-to
primaryKeyword: "Pomodoro pour le codage assisté par IA"
relatedPages: /fr/slimeforge/,/fr/blog/pomodoro-timer-for-developers/,/fr/blog/focus-rituals-pomodoro-chrome/
sourceUrls: https://www.pomodorotechnique.com/,https://news.ycombinator.com/item?id=49491745
faqs:
  - question: "Une session de codage avec IA doit-elle durer un Pomodoro entier ?"
    answer: "Utilisez un intervalle pour un résultat que vous pouvez relire, pas pour une boucle de prompts sans fin. Il peut inclure la planification, une petite implémentation et la revue, ou s'arrêter plus tôt."
  - question: "Que faire si le minuteur sonne pendant une modification générée par IA ?"
    answer: "Enregistrez l'état, notez la prochaine vérification et relisez ou testez la modification avant de commencer un autre intervalle. N'intégrez pas du code que vous ne comprenez pas."
  - question: "Un minuteur Pomodoro remplace-t-il la revue de code ?"
    answer: "Non. Il crée une limite de concentration et de revue, mais ne vérifie ni la correction, ni la sécurité, ni la maintenabilité. Utilisez les tests et la revue humaine adaptés."
---

# Pomodoro pour le codage assisté par IA : un flux de travail avec revue

Le codage assisté par IA peut transformer une petite tâche en session sans fin : demander une modification, demander une correction, envoyer un autre prompt, puis découvrir qu'un gros patch s'est accumulé sans point d'arrêt clair. Une discussion récente de développeurs sur Hacker News décrivait ce schéma : des soirées qui se prolongent et des changements générés de plus en plus difficiles à relire.

Un minuteur ne résout pas le problème à lui seul. Il peut créer une limite utile autour d'un flux où vous restez responsable de la tâche, du diff et de la décision de continuer.

## L'unité utile est un résultat vérifiable

Ne commencez pas par « laisse l'assistant coder pendant 25 minutes ». Commencez par un résultat assez petit pour être inspecté :

- ajouter une règle de validation et ses tests ;
- expliquer un test en échec et proposer une correction minimale ;
- refactoriser une fonction sans changer son comportement public ;
- écrire un plan court et vérifier la première étape.

La [technique Pomodoro®](https://www.pomodorotechnique.com/) officielle est plus qu'un compte à rebours. Sa valeur vient d'un cycle de planification, travail concentré, pauses et réflexion. Pour le travail assisté par IA, la revue fait partie du cycle.

## Un intervalle de codage avec IA en quatre parties

### 1. Définir la limite avant le prompt

Résumez la tâche en une phrase et indiquez les fichiers ou le comportement concernés. Ajoutez une condition d'arrêt : « je peux expliquer le diff et les tests pertinents ». Si l'assistant propose une refonte plus large, notez-la pour plus tard.

### 2. Demander une étape petite et inspectable

Donnez le contexte nécessaire, mais demandez une modification limitée. Demandez les hypothèses et les fichiers visés. C'est vous qui décidez si le périmètre est sûr.

### 3. Garder du temps pour l'inspection

Avant la fin de l'intervalle, lisez le diff entièrement. Lancez le test ou le contrôle pertinent le plus petit. Cherchez les changements hors sujet, la gestion d'erreurs manquante, les secrets dans les logs et les tests qui réussissent pour la mauvaise raison. Si vous ne pouvez pas résumer la modification, l'intervalle n'est pas terminé.

### 4. Fermer la boucle

Notez ce qui a changé, ce qui a été vérifié et ce qui reste. Faites ensuite la pause loin de l'éditeur. Une clôture nette facilite l'intervalle suivant et évite un bloc de prompts non relu.

## Si le minuteur vous interrompt

Le minuteur fixe une limite, mais ne demande pas un arrêt risqué. Pour une modification générée à moitié :

1. sauvegardez l'état de travail ;
2. notez la prochaine vérification ou décision précise ;
3. ne fusionnez ni ne déployez du code non relu ;
4. reprenez après la pause seulement si la tâche le mérite encore.

Si une tâche demande régulièrement plusieurs intervalles, divisez-la par comportement ou par artefact. Un bloc de 45 ou 60 minutes peut convenir au travail profond, tout en conservant des points de revue explicites.

## Un modèle de session simple

```text
Résultat : ajouter une validation du parseur et des tests
Périmètre : parser.ts, parser.test.ts
Assistant : proposer le patch minimal et expliquer les hypothèses
Revue : lire le diff, lancer les tests, vérifier les entrées invalides
Arrêt : pouvoir expliquer le comportement et le résultat
Note : cas limite ou suite à traiter
```

Ce format fonctionne avec tout assistant de codage et rend visibles les décisions humaines. Il facilite aussi la reprise après une pause sans reconstruire une conversation devenue interminable.

## Choisir un minuteur

Utilisez un intervalle court pour une tâche bien définie ou pour retrouver votre concentration. Utilisez un intervalle plus long si le chargement du contexte est le vrai coût, mais gardez la même structure de revue. Un minuteur local comme [SlimeForge](/fr/slimeforge/) peut marquer l'intervalle ; l'essentiel est la limite et l'habitude de relire, pas une durée particulière.

Si vous dépassez souvent l'heure prévue, réduisez la taille de la tâche, fixez une fin de journée ferme ou faites de la revue la première étape de l'intervalle suivant. Le but est un progrès durable et compréhensible, pas le plus gros patch possible avant minuit.

## Questions fréquentes

### Une session de codage avec IA doit-elle durer un Pomodoro entier ?

Utilisez un intervalle pour un résultat vérifiable, pas une boucle de prompts sans fin. Il peut inclure planification, implémentation et revue, ou s'arrêter plus tôt.

### Que faire au son du minuteur pendant une modification générée ?

Enregistrez l'état, notez la suite et relisez ou testez la modification avant un autre intervalle. N'intégrez pas du code incompris.

### Un minuteur Pomodoro remplace-t-il la revue de code ?

Non. Il fixe une limite, mais ne vérifie ni correction, ni sécurité, ni maintenabilité. Utilisez les tests et la revue humaine adaptés.

---
schemaVersion: 1
title: "Ton Extension Chrome T'Espionne-t-elle ? Checklist 2026"
description: "Google et Microsoft ont retiré une extension de confiance avec 1,6M d'installations pour collecte cachée de données. Comment vérifier les tiennes."
date: 2026-07-25
slug: votre-extension-chrome-vous-espionne
locale: fr
translationKey: is-your-chrome-extension-spying-on-you
product: slimeforge
contentType: how-to
primaryKeyword: "mon extension Chrome m'espionne-t-elle"
relatedPages: /fr/slimeforge/,/fr/blog/ce-que-la-faille-sonicwall-enseigne/,/fr/ressources/
sourceUrls: https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html,https://developer.chrome.com/docs/webstore/program-policies/policies,https://developer.chrome.com/blog/cws-policy-updates-2026
heading: "Ton Extension Chrome T'Espionne-t-elle ? Checklist 2026"
shortTitle: "Ton extension t'espionne-t-elle ?"
intro: "Le 10 juillet 2026, Google a retiré ModHeader, une extension de confiance comptant environ 1,6 million d'installations, après la découverte par des chercheurs d'un système complet et dormant de collecte de données intégré dans la version officielle et signée. Elle avait passé des années de scans de sécurité automatisés."
faqs:
  - question: "Comment ModHeader a-t-elle passé les scans de sécurité de Chrome pendant des années ?"
    answer: "Le collecteur était chiffré et verrouillé derrière une liste d'autorisation interne publiée vide, si bien que l'étape d'envoi ne s'exécutait jamais pendant les scans. Un scanner voit du texte chiffré et aucun trafic sortant, exactement l'apparence d'une extension propre. Les chercheurs de Stripe OLT ne l'ont trouvé qu'en lisant directement le code minifié."
  - question: "De quelles permissions une extension de concentration ou de productivité a-t-elle vraiment besoin ?"
    answer: "Une extension de concentration ne doit demander que les autorisations nécessaires à ses fonctions déclarées. SlimeForge déclare storage, alarms, scripting et activeTab ; l'accès facultatif aux sites n'est demandé que lorsque l'utilisateur active des fonctions intégrées aux pages."
  - question: "Une extension populaire et bien notée est-elle automatiquement sûre ?"
    answer: "Non. ModHeader comptait 1,6 million d'installations, un long historique, et des scores de risque automatisés allant jusqu'à 95 sur 100 la qualifiant de faible risque — et elle embarquait quand même un collecteur de données fonctionnel. Le nombre d'installations et la note mesurent la popularité, pas ce que fait le code après une mise à jour."
  - question: "Désinstaller une extension malveillante supprime-t-il les données déjà collectées ?"
    answer: "La désinstaller la retire de ton navigateur et efface son stockage local, mais n'annule rien de ce qui a déjà été envoyé aux serveurs du développeur. Si tu as déjà collé des clés d'API, des jetons ou des mots de passe dans les champs d'une extension, fais-les tourner, que cette extension s'avère compromise ou non."
---

Si tu utilises une extension Chrome ou Edge pour gérer ta concentration, tes en-têtes, tes mots de passe ou autre chose, le retrait de ModHeader mérite cinq minutes de ton temps. Pas parce que ModHeader était un outil marginal — elle comptait 1,6 million d'installations et une décennie de confiance —, mais à cause de la manière précise dont elle cachait ce qu'elle faisait.

> **Ce qui s'est réellement passé**
> Le 3 juillet 2026, Microsoft a retiré ModHeader du magasin de modules complémentaires d'Edge. Le 10 juillet, Google a fait de même en la retirant du Chrome Web Store. La société de sécurité [Stripe OLT](https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html) a découvert que l'extension officielle, signée cryptographiquement, contenait un collecteur complet d'historique de navigation : il générait une empreinte de l'appareil, chiffrait le domaine de chaque page visitée, et était conçu pour envoyer la liste quotidiennement à un serveur externe. Le collecteur n'était pas actif — une liste d'autorisation interne vide le maintenait désactivé — mais l'activer n'aurait nécessité qu'une mise à jour de routine, sans nouvelle permission, sans aucun clic de l'utilisateur.

## Pourquoi cela compte même si tu n'utilises pas ModHeader

ModHeader est un outil de développeur pour modifier les en-têtes HTTP, pas une extension de productivité. Mais le schéma qu'elle a révélé s'applique directement aux minuteurs de concentration, gestionnaires d'onglets, et toute autre extension qui demande un accès étendu :

<div class="key-points">
  <h3>Pourquoi les scans automatisés l'ont manqué</h3>
  <ul>
    <li><strong>Le chiffrement cachait la charge utile</strong> — un scanner voit du texte chiffré, pas une liste de domaines, donc rien de lisible n'a jamais quitté l'appareil pendant les tests.</li>
    <li><strong>Une liste d'autorisation vide bloquait l'envoi</strong> — le code de collecte s'exécutait, mais l'appel réseau qu'il alimentait ne se déclenchait tout simplement jamais, donc les bacs à sable ne voyaient aucun trafic sortant.</li>
    <li><strong>Le code malveillant était minifié dans une fonctionnalité légitime et opérationnelle</strong> — l'extension continuait de faire exactement ce qu'elle annonçait, ce que la plupart des revues manuelles vérifient.</li>
  </ul>
</div>

Les vérificateurs de risque automatisés ont classé l'extension à faible risque, certains lui attribuant jusqu'à 95 sur 100. Une fiche signée avec des années de bons avis signalait aux utilisateurs qu'elle était fiable. Aucun des deux signaux ne l'a détecté.

## Une checklist pratique avant de faire confiance à une extension

<div class="step-card">
  <span class="step-label">Méthode</span>
  <strong>Cinq vérifications qui prennent moins de deux minutes</strong>
  <p>Ouvre <code>chrome://extensions</code>, clique sur « Détails » pour tout ce que tu utilises quotidiennement, et vérifie : demande-t-elle à « lire et modifier toutes tes données sur tous les sites web » alors que sa fonction déclarée n'en a pas besoin ? A-t-elle changé de propriétaire récemment, ou est-elle passée de gratuite à « financée par la publicité », un schéma que les chercheurs en sécurité signalent depuis 2021 ? Le développeur publie-t-il une politique de confidentialité qui correspond réellement à ce que le code doit faire ? A-t-elle reçu une mise à jour ces dernières semaines sans journal des modifications ? Et, si possible, l'extension fonctionne-t-elle sans connexion réseau ? Un outil réellement local continuera de fonctionner ; un outil qui téléphone à la maison, non.</p>
</div>

| Signe d'une extension à moindre risque | Signe qui mérite investigation |
|---|---|
| Ne demande que les permissions nécessaires à sa fonction déclarée | Demande un accès étendu aux hôtes « au cas où » |
| Même propriétaire et journal des modifications clair dans le temps | A changé de propriétaire récemment ou est passée à la publicité |
| Fonctionne entièrement hors ligne si sa fonction n'a pas besoin du réseau | Effectue des appels réseau qu'une fonction purement locale ne devrait pas nécessiter |
| Transparente sur le fait de ne pas collecter de données de navigation | Politique de confidentialité vague ou absente |

La [politique du Chrome Web Store](https://developer.chrome.com/docs/webstore/program-policies/policies) de Google demande déjà aux développeurs de solliciter les permissions les plus restreintes qu'une fonctionnalité nécessite, et interdit de collecter l'activité de navigation en dehors d'un usage déclaré et visible pour l'utilisateur. À partir du 1er août 2026, l'[application de règles plus strictes sur la collecte de données](https://developer.chrome.com/blog/cws-policy-updates-2026) entre en vigueur dans tout le magasin — mais c'est un plancher, pas une garantie. Cela limite seulement ce qu'une extension conforme est *autorisée* à faire, et ModHeader ne déclarait pas non plus ce qu'elle avait construit.

## Ce que « uniquement local » t'apporte vraiment

Le cœur de [SlimeForge](/fr/slimeforge/) — minuteur, progression de l'animal et données de session — fonctionne sur ton appareil sans exiger de compte. Son manifeste déclare `storage`, `alarms`, `scripting` et `activeTab` pour le minuteur et les fonctions facultatives intégrées aux pages. L'activation de la licence peut contacter Creem ; les fonctions Gemini Nano facultatives s'exécutent localement lorsqu'elles sont prises en charge. C'est plus précis que d'affirmer que l'extension n'effectue jamais de requête réseau.

## Questions fréquentes

### Comment ModHeader a-t-elle passé les scans de sécurité de Chrome pendant des années ?

Le collecteur était chiffré et verrouillé derrière une liste d'autorisation interne publiée vide, si bien que l'étape d'envoi ne s'exécutait jamais pendant les scans. Un scanner voit du texte chiffré et aucun trafic sortant, exactement l'apparence d'une extension propre. Les chercheurs de Stripe OLT ne l'ont trouvé qu'en lisant directement le code minifié.

### De quelles permissions une extension de concentration ou de productivité a-t-elle vraiment besoin ?

Une extension de concentration ne doit demander que les autorisations nécessaires à ses fonctions déclarées. SlimeForge déclare `storage`, `alarms`, `scripting` et `activeTab` ; l'accès facultatif aux sites n'est demandé que lorsque l'utilisateur active des fonctions intégrées aux pages.

### Une extension populaire et bien notée est-elle automatiquement sûre ?

Non. ModHeader comptait 1,6 million d'installations, un long historique, et des scores de risque automatisés allant jusqu'à 95 sur 100 la qualifiant de faible risque — et elle embarquait quand même un collecteur de données fonctionnel. Le nombre d'installations et la note mesurent la popularité, pas ce que fait le code après une mise à jour.

### Désinstaller une extension malveillante supprime-t-il les données déjà collectées ?

La désinstaller la retire de ton navigateur et efface son stockage local, mais n'annule rien de ce qui a déjà été envoyé aux serveurs du développeur. Si tu as déjà collé des clés d'API, des jetons ou des mots de passe dans les champs d'une extension, fais-les tourner, que cette extension s'avère compromise ou non.

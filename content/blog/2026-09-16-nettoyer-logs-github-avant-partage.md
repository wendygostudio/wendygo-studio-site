---
schemaVersion: 1
title: "Nettoyer des logs GitHub avant de les partager"
description: "Une checklist pratique pour retirer les tokens, les URL de dépôts et le contexte privé des logs GitHub avant de les transmettre au support ou à un outil d’IA."
date: 2026-09-16
slug: nettoyer-logs-github-avant-partage
locale: fr
translationKey: sanitize-github-logs-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer logs GitHub"
relatedPages: /fr/scrubforge/,/fr/blog/nettoyer-configuration-paloalto/,/fr/blog/permissions-extension-chrome-checklist/
sourceUrls: https://docs.github.com/en/code-security/tutorials/remediate-leaked-secrets/remediating-a-leaked-secret,https://docs.github.com/en/actions/reference/security/secrets,https://docs.github.com/en/actions/reference/security/secure-use,https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
faqs:
  - question: "Supprimer un token d’un log GitHub suffit-il ?"
    answer: "Non. Considérez tout secret actif exposé comme compromis, révoquez-le ou faites-le tourner auprès du fournisseur, puis retirez ou masquez la copie à partager."
  - question: "GitHub masque-t-il tous les secrets dans les logs Actions ?"
    answer: "Non. GitHub documente le masquage automatique des valeurs prises en charge, mais les valeurs transformées ou structurées peuvent rester visibles ; vérifiez les logs et masquez les valeurs sensibles générées."
  - question: "Que faut-il retirer avant de partager un log GitHub ?"
    answer: "Retirez les tokens, les en-têtes d’autorisation, les URL de dépôts privés, les noms d’hôtes internes, les données personnelles et les payloads inutiles pour reproduire le problème."
  - question: "Puis-je nettoyer des logs GitHub localement ?"
    answer: "Oui. Un flux local de texte et de configuration réduit l’exposition lors de l’envoi, mais le résultat doit être vérifié manuellement et les secrets actifs traités séparément."
---

# Nettoyer des logs GitHub avant de les partager

Les logs GitHub Actions sont de précieux éléments de preuve lorsqu’un build échoue. Ils peuvent toutefois contenir beaucoup plus de contexte que nécessaire pour le support ou un assistant d’IA : URL de dépôt, nom de branche, hôte interne, chemin local, titre de pull request, adresse e-mail, en-tête d’autorisation ou token imprimé par une commande.

Travaillez sur une copie, retirez le contexte privé inutile, vérifiez le résultat, puis partagez-le. Cette démarche limite la divulgation mais ne remplace pas une réponse à incident : si un secret actif apparaît dans le log, révoquez-le ou faites-le tourner auprès du fournisseur avant toute chose.

## Les éléments à contrôler

Recherchez notamment :

- tokens, clés API, JWT, clés privées et en-têtes `Authorization` ;
- URL de dépôts privés, noms d’hôtes internes, identifiants cloud et chemins locaux ;
- noms de déploiements, clusters, bases de données et variables d’environnement ;
- adresses e-mail, noms d’utilisateur, texte de tickets ou payloads contenant des données personnelles ;
- rapports et corps de requête inutiles pour reproduire l’erreur.

Conservez l’erreur, le code de sortie, les versions pertinentes et l’entrée minimale nécessaire. Remplacez les valeurs par des marqueurs stables comme `<GITHUB_TOKEN>` ou `<HOTE_INTERNE>` afin de préserver la forme du problème sans révéler la valeur réelle.

## Procédure locale

1. Copiez le log dans un fichier local temporaire et gardez l’original dans son environnement sécurisé.
2. Cherchez `token`, `secret`, `password`, `Authorization`, `BEGIN PRIVATE KEY`, les URL, les hôtes et les adresses e-mail. Inspectez aussi les longues chaînes opaques.
3. Remplacez les valeurs sensibles par des marqueurs typés et réutilisez le même marqueur pour une même valeur.
4. Supprimez les étapes sans rapport, les corps de requête et les dumps d’environnement.
5. Relisez tout le fichier final, y compris les blocs de code, les lignes voisines et les pièces jointes.
6. Partagez la copie nettoyée via le canal de support approuvé et notez les types de valeurs retirés.

ScrubForge peut aider à nettoyer localement une copie de log ou de configuration. Le brouillon reste dans l’onglet du navigateur jusqu’à sa copie. Vérifiez néanmoins le résultat : aucun outil ne connaît automatiquement les règles de divulgation de votre organisation.

## Les limites du masquage GitHub

La [référence GitHub sur les secrets](https://docs.github.com/en/actions/reference/security/secrets) documente le masquage automatique des valeurs secrètes prises en charge dans les logs de workflow, mais ce mécanisme ne constitue pas une revue complète. Les valeurs transformées, encodées, découpées ou structurées peuvent ne pas être reconnues. GitHub recommande aussi de masquer les valeurs sensibles qui ne sont pas enregistrées comme secrets GitHub et d’éviter les commandes qui les affichent.

Si un workflow doit utiliser un secret externe pour un diagnostic, masquez-le avant qu’une commande puisse l’afficher. Relisez tout de même le log avant son export : il peut révéler des noms de dépôts, la topologie, des données utilisateur ou une valeur reconstruite.

## Si un secret a déjà été exposé

Révoquez-le ou faites-le tourner selon la procédure du fournisseur, localisez les copies du log et vérifiez les accès. Supprimer une ligne de l’affichage actuel ne supprime pas les copies dans les artefacts, caches, tickets, exports de chat ou l’historique du dépôt. Si le secret est entré dans l’historique Git, suivez après la révocation les étapes de coordination et de réécriture indiquées par GitHub.

## Checklist avant l’envoi

1. Tous les éléments ressemblant à des identifiants ont-ils été retirés ou remplacés ?
2. Les secrets actifs exposés ont-ils été révoqués ou renouvelés ?
3. Les URL, hôtes internes et données personnelles sont-ils nécessaires au diagnostic ?
4. Les artefacts, captures et commandes collées ont-ils été relus ?
5. Le log conserve-t-il l’erreur, les versions et le contexte de reproduction ?

Voir aussi [nettoyer une configuration Palo Alto PAN-OS avant de la partager](/fr/blog/nettoyer-configuration-paloalto/) et [ScrubForge](/fr/scrubforge/).

## Questions fréquentes

### Supprimer un token d’un log GitHub suffit-il ?

Non. Considérez le secret actif comme compromis, révoquez-le ou faites-le tourner, puis nettoyez la copie à partager.

### GitHub masque-t-il tous les secrets dans les logs Actions ?

Non. Les valeurs prises en charge peuvent être masquées, mais les valeurs transformées ou structurées peuvent passer au travers. Relisez les logs et masquez explicitement les valeurs générées.

### Que retirer avant de partager un log ?

Les tokens, en-têtes d’autorisation, URL privées, noms d’hôtes internes, données personnelles et payloads inutiles.

### Puis-je nettoyer des logs localement ?

Oui, mais relisez toujours le résultat et traitez séparément les secrets actifs.

---
schemaVersion: 1
title: "Secret Kubernetes data ou stringData : quand Base64 est nécessaire"
description: "Comprenez quand un Secret Kubernetes exige Base64 dans data, quand stringData est plus simple et pourquoi le codage ne remplace pas le chiffrement."
date: 2026-08-28
slug: secret-kubernetes-data-vs-stringdata
locale: fr
translationKey: kubernetes-secret-data-vs-stringdata
product: textforge
contentType: how-to
primaryKeyword: "Secret Kubernetes data ou stringData"
relatedPages: /fr/textforge/,/fr/scrubforge/,/fr/blog/base64-encode-kubernetes-secrets/,/fr/blog/remove-secrets-kubernetes-config/
sourceUrls: https://kubernetes.io/docs/concepts/configuration/secret/,https://kubernetes.io/docs/concepts/security/secrets-good-practices/
faqs:
  - question: "Les valeurs de data d'un Secret Kubernetes doivent-elles être en Base64 ?"
    answer: "Oui. Les valeurs du champ data sont sérialisées comme des chaînes Base64. stringData accepte du texte ordinaire et le serveur d'API l'encode lors de la création ou de la mise à jour."
  - question: "Faut-il utiliser data ou stringData dans un manifeste ?"
    answer: "Utilisez stringData pour du texte littéral si votre flux de déploiement le prend en charge. Utilisez data si vous avez besoin de la représentation sérialisée ou si votre outil attend des valeurs déjà encodées."
  - question: "Base64 protège-t-il un Secret Kubernetes ?"
    answer: "Non. Base64 est un encodage réversible, pas un chiffrement. Protégez le manifeste et l'accès au cluster selon les recommandations Kubernetes."
---

# Secret Kubernetes data ou stringData : quand Base64 est nécessaire

Les champs `data` et `stringData` d'un Secret Kubernetes représentent les mêmes valeurs logiques, mais leurs interfaces de saisie diffèrent. `data` attend des chaînes encodées en Base64. `stringData` accepte du texte ordinaire et laisse le serveur d'API Kubernetes effectuer l'encodage.

Cette différence compte lorsque vous écrivez, relisez ou modifiez un manifeste. Aucun des deux champs n'est une frontière de sécurité : Base64 est un encodage, pas un chiffrement.

## La différence pratique

Utilisez `data` lorsqu'une valeur est déjà sérialisée pour l'API Secret :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: identifiants-app
type: Opaque
data:
  username: YWRtaW4=
  password: c2FtcGxlLXBhc3M=
```

Utilisez `stringData` pour écrire des valeurs littérales :

```yaml
stringData:
  username: admin
  password: sample-pass
```

La [documentation Kubernetes sur les Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) décrit `stringData` comme une saisie pratique pour les valeurs non encodées. Elle précise aussi que `stringData` fonctionne mal avec server-side apply : vérifiez donc votre méthode de déploiement.

## Quel champ choisir ?

`stringData` est souvent le plus lisible pour un nouveau manifeste écrit à la main, si votre flux le prend en charge. `data` est utile lorsqu'un autre système génère déjà la forme sérialisée, quand vous modifiez un manifeste existant ou lorsque vos outils attendent des valeurs encodées.

Ne commitez pas de vrais identifiants dans un dépôt sous prétexte qu'ils sont placés dans `data`. Toute personne qui lit le manifeste peut décoder les valeurs. Kubernetes sépare la sécurité d'accès et de distribution du Secret de sa représentation YAML.

## Encoder ou décoder localement

Si un manifeste contient une valeur dans `data`, décodez au besoin une copie locale pour l'inspecter. Pour créer une valeur `data`, encodez localement la valeur brute et ne copiez que le résultat dans le manifeste de travail.

TextForge encode et décode le texte dans le navigateur sans envoyer la valeur à un serveur Wendygo. Utilisez une copie et conservez l'original dans son environnement sécurisé. Pour partager un manifeste, [ScrubForge](https://wendygostudio.com/fr/scrubforge/) convient mieux : nettoyez la copie avant de la partager, plutôt que de seulement encoder le Secret.

## Liste de décision

1. Écrivez-vous un nouveau Secret à partir de texte littéral ? Envisagez `stringData` après vérification de votre méthode d'application.
2. Modifiez-vous un champ `data` existant ? Décodez uniquement une copie locale si l'inspection est nécessaire.
3. Votre pipeline exige-t-il `data` ? Encodez localement puis validez le YAML.
4. Le manifeste sort-il de votre environnement sécurisé ? Supprimez ou remplacez les identifiants avant de le partager.
5. Un identifiant a-t-il pu être exposé ? Faites-le tourner ; l'encodage ou le nettoyage ne supprime pas l'exposition.

Consultez les [bonnes pratiques Kubernetes pour les Secrets](https://kubernetes.io/docs/concepts/security/secrets-good-practices/) avec votre propre politique d'accès au cluster.

## Questions fréquentes

### Les valeurs de `data` doivent-elles être en Base64 ?

Oui. `data` est sérialisé sous forme de chaînes Base64. `stringData` accepte du texte et Kubernetes l'encode lors de la création ou de la mise à jour.

### Faut-il utiliser `data` ou `stringData` ?

Utilisez `stringData` pour du texte littéral si votre flux le permet. Utilisez `data` si vos outils exigent la forme sérialisée.

### Base64 protège-t-il un Secret ?

Non. C'est un encodage réversible, pas un chiffrement. Protégez le manifeste, le cluster et le dépôt.

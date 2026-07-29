---
schemaVersion: 1
title: "Descodificar um JWT localmente e ler claims"
description: "Leia o cabeçalho e os claims de um JWT no navegador sem carregar o token."
date: 2026-07-26
slug: descodificar-jwt-localmente
locale: pt
translationKey: decode-jwt-online
product: textforge
contentType: how-to
primaryKeyword: "descodificar JWT localmente"
relatedPages: /textforge/
---

Um JSON Web Token contém normalmente cabeçalho, payload e assinatura. Cabeçalho e payload são codificados, não cifrados: pode ler localmente a expiração (`exp`) ou os claims.

Cole o token no [TextForge](/pt/textforge/) e consulte os campos descodificados. Não partilhe tokens sem necessidade: podem conter dados pessoais ou informações de acesso.

Uma descodificação bem-sucedida não prova que o token é autêntico, válido ou autorizado. A aplicação deve verificar assinatura, emissor, público e duração segundo as suas regras de segurança.

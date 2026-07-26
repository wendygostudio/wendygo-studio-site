---
schemaVersion: 1
locale: pt
translationKey: decode-jwt-online
xDefaultPath: /blog/decode-jwt-online/
title: "Descodificar um JWT localmente e ler claims"
description: "Leia o cabeçalho e os claims de um JWT no navegador sem carregar o token."
date: 2026-07-26
slug: descodificar-jwt-localmente
product: TextForge
contentType: how-to
primaryKeyword: "descodificar JWT localmente"
relatedPages: "/pt/textforge/,/blog/decode-jwt-online/"
heading: "Descodificar um JWT localmente"
intro: "Leia as partes visíveis de um JWT sem o enviar para um descodificador online."
faqs:
  - question: "Descodificar verifica a assinatura JWT?"
    answer: "Não. Ler cabeçalho e payload não verifica a assinatura nem a confiança."
---

Um JSON Web Token contém normalmente cabeçalho, payload e assinatura. Cabeçalho e payload são codificados, não cifrados: pode ler localmente a expiração (`exp`) ou os claims.

Cole o token no [TextForge](/pt/textforge/) e consulte os campos descodificados. Não partilhe tokens sem necessidade: podem conter dados pessoais ou informações de acesso.

Uma descodificação bem-sucedida não prova que o token é autêntico, válido ou autorizado. A aplicação deve verificar assinatura, emissor, público e duração segundo as suas regras de segurança.

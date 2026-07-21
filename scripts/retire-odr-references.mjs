import fs from 'node:fs';
import path from 'node:path';

const roots = ['public'];
const textExtensions = new Set(['.html']);
const replacements = [
  [/A seller who refuses a valid warranty claim is breaking EU law\. Your options, in order:/gi, 'If a seller refuses a claim that appears covered by the legal guarantee, ask for the reason in writing and check the applicable national rules. Possible next steps include:'],
  [/Un vendedor que rechaza una reclamación de garantía válida está incumpliendo la ley de la UE\. Tus opciones, por orden:/gi, 'Si el vendedor rechaza una reclamación que parece cubierta por la garantía legal, pide el motivo por escrito y comprueba las normas nacionales aplicables. Entre los posibles pasos están:'],
  [/ADR decisions are usually binding on the trader\. As a consumer, you are generally not bound — you can still go to court if unsatisfied with the outcome\./gi, "It depends on the ADR body, national law and whether the parties agreed to participate. Check the body's current rules before filing."],
  [/It depends on the ADR body\. Most EU-certified ADR bodies issue decisions binding on the trader if they agreed to participate\. As a consumer, you are generally not bound — you can still go to court if (?:unsatisfied|you disagree with the outcome)\.?(?: Check the ADR body's rules before submitting\.)?/gi, "It depends on the ADR body, national law and the parties' agreement to participate. Check the body's current rules and do not assume every ADR outcome has the same legal effect."],
  [/Las decisiones de ADR generalmente son vinculantes para el comerciante\. Como consumidor, generalmente no estás vinculado — aún puedes ir a los tribunales si no estás satisfecho con el resultado\./gi, 'Depende del organismo ADR, la legislación nacional y la participación acordada por las partes. Consulta sus reglas vigentes antes de presentar la reclamación.'],
  [/Depende del organismo de ADR\. La mayoría de organismos de ADR certificados por la UE emiten decisiones vinculantes para el comerciante si acordaron participar\. Como consumidor, generalmente no estás vinculado — aún puedes ir a los tribunales si no estás de acuerdo con el resultado\. Verifica las reglas del organismo de ADR antes de presentar\./gi, 'Depende del organismo ADR, la legislación nacional y la participación acordada por las partes. Consulta sus reglas vigentes y no asumas que todas las decisiones producen el mismo efecto jurídico.'],
  [/EU consumer rights are self-enforcing in the sense that the mechanisms for asserting them — ADR bodies, national authorities, the ECC-Net, small claims courts — are all designed to be accessible without legal representation\. Most are free\. Most can be started online in under 30 minutes\./gi, 'EU consumers can use several routes without immediately hiring a lawyer, including ADR bodies, national authorities, ECC-Net and the European Small Claims Procedure. Eligibility, costs and procedure depend on the dispute and country.'],
  [/Los derechos consumidor UE se hacen valer mediante mecanismos diseñados para acceso sin abogado: organismos RAL, autoridades nacionales, ECC-Net, juzgados pequeñas reclamaciones\. La mayoria son gratuitos e iniciables online en menos 30 minutos\./gi, 'Los consumidores de la UE pueden usar varias vías sin contratar inmediatamente a un abogado: organismos ADR, autoridades nacionales, ECC-Net y el proceso europeo de escasa cuantía. Los requisitos, costes y procedimiento dependen del conflicto y del país.'],
  [/30–90 days for most ADR cases/gi, 'Varies by ADR body and national procedure'],
  [/Free or under €20 in most EU countries/gi, 'Varies by body; check its current fees'],
  [/30–90 días para la mayoría de casos de ADR/gi, 'Varía según el organismo ADR y el procedimiento nacional'],
  [/Gratuito o menos de €20 en la mayoría de países de la UE/gi, 'Varía según el organismo; consulta sus tarifas vigentes'],
  [/How long does the EU ODR process take\?/gi, 'How long does an ADR procedure take?'],
  [/¿Cuánto tiempo tarda el proceso ODR de la UE\?/gi, '¿Cuánto tarda un procedimiento ADR?'],
  [/If the seller is established in the EU, the ECC-Net applies\./gi, 'If the trader is in another EU country, Iceland or Norway, your national European Consumer Centre may be able to help.'],
  [/Si está UE, aplica ODR\./gi, 'Si el comerciante está en otro país de la UE, Islandia o Noruega, tu Centro Europeo del Consumidor puede orientarte.'],
  [/Si el vendedor está establecido en la UE, se aplica la ECC-Net\./gi, 'Si el comerciante está en otro país de la UE, Islandia o Noruega, tu Centro Europeo del Consumidor puede orientarte.'],
  [/the EU's dispute resolution platform handles cross-border cases at no cost/gi, 'contact an appropriate ADR body or your national European Consumer Centre for an eligible cross-border dispute'],
  [/la plataforma de resolución de litigios de la UE gestiona casos transfronterizos sin coste/gi, 'contacta con un organismo ADR adecuado o con tu Centro Europeo del Consumidor para un conflicto transfronterizo elegible'],
  [/Better for cross-border disputes; routes your claim through the right authority/gi, 'May help with an eligible dispute involving a trader in another EU country, Iceland or Norway'],
  [/mejor para disputas transfronterizas; canaliza tu reclamación a la autoridad correcta/gi, 'puede orientar en conflictos elegibles con comerciantes de otro país de la UE, Islandia o Noruega'],
  [/Where to file, what to say, and what to expect from ADR and ODR/gi, 'Where to file, what to say, and what to expect from ADR and ECC-Net'],
  [/ECC-Net \(hasta 4 meses\)/gi, 'ECC-Net (plazo variable)'],
  [/Up to 4 months total in the worst case: 30 days for both parties to agree on an ADR body, then up to 90 days for the ADR to resolve the dispute\. Many cases resolve faster in practice\./gi, 'Timelines vary by ADR body and national procedure. Check the current rules of the body handling the case before filing.'],
  [/Up to 4 months in the worst case: 30 days for both parties to agree on an ADR body, then up to 90 days for the ADR to resolve the dispute\. Many cases resolve faster — some ADR bodies have average resolution times of 30–45 days\./gi, 'Timelines vary by ADR body and national procedure. Check the current rules of the body handling the case before filing.'],
  [/Hasta 4 meses en el peor de los casos: 30 días para que ambas partes acuerden un organismo de ADR, luego hasta 90 días para que el ADR resuelva la disputa\. Muchos casos se resuelven más rápido — algunos organismos de ADR tienen tiempos de resolución promedio de 30–45 días\./gi, 'Los plazos varían según el organismo ADR y el procedimiento nacional. Consulta las reglas vigentes del organismo que tramite el caso antes de presentar la reclamación.'],
  [/<strong>Timeline:<\/strong> Up to 4 months/gi, '<strong>Timeline:</strong> Varies by route and country'],
  [/For EU ODR: log in → select seller's country → describe the dispute → attach documentation → the platform connects you to a certified ADR body\./gi, 'For ECC-Net: contact the European Consumer Centre in your own country after first trying to resolve the dispute with the trader. Provide the purchase details, correspondence and supporting evidence.'],
  [/Para ODR de la UE: inicia sesión → selecciona el país del vendedor → describe la disputa → adjunta documentación → la plataforma te conecta con un organismo de ADR certificado\./gi, 'Para ECC-Net: contacta con el Centro Europeo del Consumidor de tu propio país después de intentar resolver el conflicto con el vendedor. Aporta los datos de compra, comunicaciones y pruebas.'],
  [/For purchases from a seller in a different EU country, use the EU ODR platform first\. It automatically routes your complaint to the certified ADR body in the seller's country and handles the process in your language — no need to navigate foreign consumer law on your own\./gi, 'For a dispute with a trader in another EU country, Iceland or Norway, contact the European Consumer Centre in your own country. It can explain your options and may help seek an amicable settlement with the foreign trader.'],
  [/Para compras de un vendedor en un país diferente de la UE, usa primero la plataforma ODR de la UE\. Automáticamente envía tu reclamación al organismo de ADR certificado en el país del vendedor y gestiona el proceso en tu idioma — sin necesidad de navegar la ley de consumidor extranjera por tu cuenta\./gi, 'Para un conflicto con un comerciante de otro país de la UE, Islandia o Noruega, contacta con el Centro Europeo del Consumidor de tu propio país. Puede explicarte las opciones y ayudarte a buscar una solución amistosa.'],
  [/The EU Online Dispute Resolution platform \(<strong>ec\.europa\.eu\/consumers\/odr<\/strong>\) is built for disputes where you and the seller are in different EU countries\. It routes your complaint to the right ADR body in the seller's country and handles the process in your language\. File here if the seller is based in another EU member state\./gi, 'For an eligible dispute with a trader in another EU country, Iceland or Norway, contact the European Consumer Centre in your own country after trying to resolve the issue directly. ECC-Net can explain the available routes and may help seek an amicable settlement.'],
  [/The official EU platform for cross-border disputes at <strong>ec\.europa\.eu\/consumers\/odr<\/strong>\. Routes your complaint to the right ADR body in the seller's country and handles translation\./gi, 'For eligible cross-border purchases, contact the European Consumer Centre in your own country. ECC-Net can explain the available routes and may help with communication involving a trader abroad.'],
  [/La plataforma oficial de la UE para disputas transfronterizas en <strong>ec\.europa\.eu\/consumers\/odr<\/strong>\. Envía tu reclamación al organismo de ADR correcto en el país del vendedor y gestiona la traducción\./gi, 'Para compras transfronterizas elegibles, contacta con el Centro Europeo del Consumidor de tu propio país. ECC-Net puede explicar las vías disponibles y ayudar con un comerciante extranjero.'],
  [/Up to 4 months total in the worst case: 30 days to agree on an ADR body, then 90 days for the ADR to resolve the dispute\. In practice, many cases resolve faster\./gi, 'Timelines depend on the selected ADR body and national procedure. Check the current rules of the body handling the case.'],
  [/Hasta 4 meses en total en el peor de los casos: 30 días para acordar un organismo ADR, luego 90 días para que el ADR resuelva la disputa\. En la práctica, muchos casos se resuelven más rápido\./gi, 'Los plazos dependen del organismo ADR y del procedimiento nacional. Consulta las reglas vigentes del organismo que tramite el caso.'],
  [/EU Online Dispute Resolution platform at ec\.europa\.eu\/consumers\/odr/gi, 'European Consumer Centre in your country or an appropriate national ADR body'],
  [/EU Online Dispute Resolution platform/gi, 'European Consumer Centres Network (ECC-Net)'],
  [/Online Dispute Resolution platform/gi, 'European Consumer Centres Network (ECC-Net)'],
  [/EU ODR Platform/gi, 'ECC-Net'],
  [/EU ODR platform/gi, 'ECC-Net'],
  [/ODR platform/gi, 'ECC-Net'],
  [/plataforma de Resolución de Litigios en Línea de la UE/gi, 'Red de Centros Europeos del Consumidor (ECC-Net)'],
  [/plataforma de Resolución de Litigios en Línea/gi, 'Red de Centros Europeos del Consumidor (ECC-Net)'],
  [/Plataforma ODR de la UE/gi, 'ECC-Net'],
  [/plataforma ODR de la UE/gi, 'ECC-Net'],
  [/plataforma ODR UE/gi, 'ECC-Net'],
  [/plataforma ODR/gi, 'ECC-Net'],
  [/disputa ODR/gi, 'reclamación mediante ADR o ECC-Net'],
  [/File an ODR dispute/gi, 'Use ADR or ECC-Net'],
  [/\bODR\b/g, 'ECC-Net'],
  [/ec\.europa\.eu\/consumers\/odr/gi, 'europa.eu/youreurope/citizens/consumers/consumers-dispute-resolution/']
];

let changed = 0;
for (const root of roots) {
  const stack = [path.resolve(root)];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(target);
      else if (textExtensions.has(path.extname(entry.name))) {
        const before = fs.readFileSync(target, 'utf8');
        let after = before;
        for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
        if (after !== before) {
          fs.writeFileSync(target, after, 'utf8');
          changed++;
        }
      }
    }
  }
}
console.log(`Retired ODR references in ${changed} public files`);

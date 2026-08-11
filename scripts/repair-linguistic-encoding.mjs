import fs from 'node:fs';
import path from 'node:path';

const replacements = {
  // French
  '� ouvrir': 'à ouvrir', '� créer': 'à créer', '� ajuster': 'à ajuster', '� exporter': 'à exporter',
  'D�duplication': 'Déduplication', 'Donn�es': 'Données', 'd�tapes': 'd’étapes', 'Lorsquun': 'Lorsqu’un',
  'nouvelle�:': 'nouvelle :', 'Co�t�:': 'Coût :', 'lUE': 'l’UE', '�tudiants': 'étudiants',
  '�tapes': 'étapes', 't�che': 'tâche', 'dur�e': 'durée', 's�ances': 'séances', 'r�compense': 'récompense',
  'm�canique': 'mécanique', 'gacha �thique': 'gacha éthique', '� Id�al': ' — Idéal', 'Id�al': 'Idéal',
  'gestion des t�ches': 'gestion des tâches', 'n�cessit�es': 'nécessitées', 'Exag�ration': 'Exagération',
  'm�moire': 'mémoire', 'suffisamment de m�moire': 'suffisamment de mémoire',
  // Portuguese
  '�cone': 'ícone', '� distância': 'à distância', 'declara��es': 'declarações', 'configura��o': 'configuração',
  'gest�o': 'gestão', 'par�metros': 'parâmetros', 'gamifica��o': 'gamificação', 'al�m': 'além',
  'sess�es': 'sessões', 'n�o': 'não', 'fun��es': 'funções', 'extra�dos': 'extraídos', 'pr�tica': 'prática',
  'instala��o': 'instalação', 'focagem': 'focagem', 'motiva��o': 'motivação', 'mec�nica': 'mecânica',
  'desduplica��o': 'desduplicação', 'pa�s': 'país', 'poss�vel': 'possível', 'utilizador': 'utilizador',
  // German and Spanish
  'Geb�hr': 'Gebühr', 'Kan�le': 'Kanäle', 'm�chten': 'möchten', 'pers�nlich': 'persönlich', 'g�nstig': 'günstig',
  'vors�tzlichen': 'vorsätzlichen', 'Betr�ge': 'Beträge', 'Anmeldegeb�hren': 'Anmeldegebühren',
  'garant�a': 'garantía', 'lo �ltimo': 'lo último', 'dise��': 'diseñó', 'S�,': 'Sí,', 'disputa de 200 �': 'disputa de 200 €',
  'm�s de': 'más de', 's� misma': 'sí misma', 'menos de 30 �': 'menos de 30 €',
  // Remaining recurrent accents and punctuation recovered from context
  'cr�er': 'créer', '� 720': '× 720', '� coller': 'à coller', '� l’': 'à l’', '� l': 'à l', '� huit': 'à huit',
  'm�rite': 'mérite', '� un avocat': 'à un avocat', 'derni�re': 'dernière', 'co�teraient': 'coûteraient',
  'lui-m�me': 'lui-même', 'g�n�ralement': 'généralement', 'd�poser': 'déposer', 'd�p�t': 'dépôt',
  'compara�tre': 'comparaître', 'plut�t': 'plutôt', 'r�seau': 'réseau', 'd�pannage': 'dépannage',
  'n�cessaire': 'nécessaire', 'd�cider': 'décider', 'd�marre': 'démarre', 'm�me': 'même', 'apr�s': 'après',
  'cr�e': 'crée', 'activit�s': 'activités', 'vid�os': 'vidéos', 'intrins�quement': 'intrinsèquement',
  'd�cisions': 'décisions', 'repr�sentatif': 'représentatif', 'pr�paration': 'préparation', 'v�rification': 'vérification',
  'dist�ncia': 'distância', 'padr�o': 'padrão', 'cont�m': 'contêm', '�mbito': 'âmbito', 'col�-los': 'colá-los',
  'h�bito': 'hábito', 'depura��o': 'depuração', 'produ��o': 'produção', 'panor�micas': 'panorâmicas',
  'composi��es': 'composições', 'visualiza��o': 'visualização', 'ret�ngulo': 'retângulo', 'propor��es': 'proporções',
  'paisagens': 'paisagens', 'espec�fico': 'específico', 'espa�os': 'espaços', 'c�mara': 'câmara', 'padr�o': 'padrão',
  'Isl�ndia': 'Islândia', 'orienta��o': 'orientação', 'amig�vel': 'amigável', 'reclama��o': 'reclamação',
  'pr�pria': 'própria', 'tamb�m': 'também', 'poder�': 'poderá', 'dispon�veis': 'disponíveis', 'ajud�-lo': 'ajudá-lo',
  'incompat�veis': 'incompatíveis', 'inconsist�ncias': 'inconsistências', 'aleat�rios': 'aleatórios', 'd�-lhe': 'dá-lhe',
  'est�': 'está', 'sess�o': 'sessão', 'esp�cie': 'espécie', '�ncora': 'âncora', 'amanh�': 'amanhã', 'dif�cil': 'difícil',
  'varia��o': 'variação', '�ngulo': 'ângulo', 'cobri�': 'cobriu', 'est�dio': 'estúdio', 'cron�metro': 'cronómetro',
  'recompensa': 'recompensa', 'n�vel': 'nível', 'esp�cies': 'espécies', 'miss�es': 'missões', 'minijogos': 'minijogos',
  'tarefa�:': 'tarefa :', '15�minutes': '15 minutes', '25�minutes': '25 minutes', 'pour�:': 'pour :',
  '� d�marrer': 'à démarrer', 'gamifi�es': 'gamifiées', 'r�sultant': 'résultant', 'r�duit': 'réduit',
  'd�pend': 'dépend', 'r�compenses': 'récompenses', 'laccomplissement': 'l’accomplissement', 'Lanimal': 'L’animal',
  'dune': 'd’une', 'davance': 'd’avance', 'dautre': 'd’autre', 'd�': 'd’', '�crire': 'écrire', '�tudier': 'étudier',
  '�lan': 'élan', 'd�finies': 'définies', 'r�unions': 'réunions', 'd�fendre': 'défendre', 'm�langent': 'mélangent',
  'r�les': 'rôles', 'mod�r�e': 'modérée', 'r�initialiser': 'réinitialiser', '�vitez': 'Évitez', 'cr�er une': 'créer une',
  'm�moire': 'mémoire', 'tr�s': 'très', 'pr�alable': 'préalable'
  , '� cr�er': 'à créer', '� dist�ncia': 'à distância', 'jwt.io �': 'jwt.io é', 'conveniente. Mas envia': 'conveniente. Mas envia',
  'terceiros � um': 'terceiros é um', 'ferramenta padr�o': 'ferramenta padrão', 'h�bito': 'hábito', '�mbito': 'âmbito',
  'Pais�is': 'Países', 'pais�': 'país', 'panor�micas': 'panorâmicas', 'composi��es': 'composições', 'largura �': 'largura é',
  'pain�is': 'painéis', 'est�o': 'estão', 'chamadas � a��o': 'chamadas à ação', 'links r�pidos': 'links rápidos',
  'T�m ': 'Têm ', '320�160': '320×160', 'dif�ceis': 'difíceis', 'mostrar�': 'mostrará', 'est�o mais': 'estão mais',
  'pr�ximas': 'próximas', 'dom�nio': 'domínio', 'exporta��es': 'exportações', 'v�rias': 'várias', 'Isl�ndia': 'Islândia',
  'lit�gio': 'litígio', 'solu��o': 'solução', 'dispon�veis': 'disponíveis', 'ind�cios': 'indícios', 's�o quase': 'são quase',
  'Anwalt': 'Anwalt', 'k�nnen': 'können', 'L�ndern': 'Ländern', 'f�r Verbraucher': 'für Verbraucher', '30��': '30 €',
  'Europ�ischen': 'Europäischen', 'gr��tenteils': 'größtenteils', 'm�ssen': 'müssen', 'F�llen': 'Fällen', 'm�ssen f�r': 'müssen für',
  'ausgesch�pft': 'ausgeschöpft', 'R�ckgabe': 'Rückgabe', 'kost�': 'kosté', 'costar�an': 'costarían', 'm�s que': 'más que',
  's� es necesario': 'sí es necesario', 'despu�s': 'después', 'mayor�a': 'mayoría', 'est�ndar': 'estándar', 'aplicaci�n': 'aplicación',
  'europ�en': 'européen', 'a �t�': 'a été', '�t�': 'été', 'd�lib�r�': 'délibéré', 'con�u': 'conçu', 'conna�tre': 'connaître',
  '�chou�': 'échoué', 'd�poser': 'déposer', 'proc�dure': 'procédure', 'rembours�': 'remboursé', 'd�passe': 'dépasse',
  '�puis�': 'épuisé', 'certifi�s': 'certifiés', 'co�teux': 'coûteux', '�lev�': 'élevé', 'd�lib�r�e': 'délibérée',
  'n�cessitent': 'nécessitent', '�tudiants': 'étudiants', 'v�ritables': 'véritables', '�tude': 'étude', 'contr�le': 'contrôle',
  'gamifi�es': 'gamifiées', 'al�atoires': 'aléatoires', 'pay�': 'payé', 'r�serv�': 'réservé', '�s': 'ès', 'apr�s': 'après',
  'commenc�': 'commencer', 'd�cisionnelle': 'décisionnelle', 'journ�e': 'journée', 'premi�re': 'première', '�clore': 'éclore',
  'd�bloquent': 'débloquen', 's�ance': 'séance', 'd�pend': 'dépend', 'd�cider': 'décider', 'd�part': 'départ',
  'inachev�es': 'inachevées', 'n�gociation': 'négociation', 'r�p�table': 'répétable', 'pr�te': 'prête', 'probl�me': 'problème',
  'la m�me': 'la même', 'red�marrage': 'redémarrage', 'tr�s volumineuses': 'très volumineuses', 'limit�es': 'limitées', 'g�r�': 'géré'
};
let changed = 0;
for (const name of fs.readdirSync('content/blog')) {
  if (!name.endsWith('.md')) continue;
  const full = path.join('content/blog', name);
  const before = fs.readFileSync(full, 'utf8');
  let after = before;
  for (const [from, to] of Object.entries(replacements)) after = after.replaceAll(from, to);
  if (after !== before) { fs.writeFileSync(full, after, 'utf8'); changed++; }
}
console.log(`Applied linguistic repairs to ${changed} source files`);

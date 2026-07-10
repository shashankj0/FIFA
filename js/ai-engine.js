/**
 * ArenaMind 2026 - Generative AI Simulation Engine
 * Simulates Gemini LLM behavior with streaming output, multilingual translation,
 * and contextual analysis of current stadium sensor values.
 */

class StadiumAIEngine {
  constructor() {
    this.initTranslations();
  }

  // Define intent mapping & responses for multilingual simulation
  initTranslations() {
    this.intentResponses = {
      accessibility_entrance: {
        en: "♿ **Accessibility Route Guidance**: The nearest wheelchair-accessible entrance is at **Gate A (North)**, featuring low-gradient ramps and dedicated assistance desks. Additionally, the **Sensory Friendly Room** is located in Concourse 1, offering a calm environment for fans with sensory needs. Elevators are accessible from all main concourses.",
        es: "♿ **Guía de Ruta de Accesibilidad**: La entrada accesible en silla de ruedas más cercana está en la **Puerta A (Norte)**, con rampas de pendiente baja y mesas de asistencia dedicada. Además, la **Sala Sensorial Amigable** está en la Galería 1, ofreciendo un ambiente tranquilo. Los ascensores están accesibles desde todos los pasillos principales.",
        fr: "♿ **Guidage d'Accessibilité**: L'entrée accessible en fauteuil roulant la plus proche se trouve à la **Porte A (Nord)**, avec des rampes à faible pente. De plus, la **Salle Sensorielle** est située dans le Hall 1, offrant un environnement calme. Des ascenseurs sont accessibles depuis tous les halls principaux.",
        ar: "♿ **دليل مسار ذوي الاحتياجات الخاصة**: أقرب مدخل متاح للكراسي المتحركة هو **البوابة A (الشمالية)**، ويتميز بمنحدرات منخفضة الارتفاع ومكاتب مساعدة مخصصة. بالإضافة إلى ذلك، تقع **الغرفة الحسية المريحة** في البهو 1، مما يوفر بيئة هادئة للجماهير. المصاعد متوفرة في جميع البهو الرئيسية.",
        de: "♿ **Barrierefreie Wegführung**: Der nächste barrierefreie Eingang befindet sich an **Tor A (Nord)** mit flachen Rampen und speziellen Service-Schaltern. Zudem liegt der **sensorisch beruhigte Raum** im Korridor 1 und bietet eine ruhige Umgebung. Aufzüge sind von allen Hauptgängen aus erreichbar.",
        ja: "♿ **バリアフリー案内**: 車椅子でご利用いただける最寄りの入口は**ゲートA（北口）**です。緩やかなスロープと専用サポートデスクが設置されています。また、感覚に配慮した**センサリー・フレンドリールーム**はコンコース1にあり、落ち着いた環境を提供しています。エレベーターはすべての主要コンコースからアクセス可能です。",
        pt: "♿ **Guia de Rota de Acessibilidade**: A entrada acessível para cadeiras de rodas mais próxima é no **Portão A (Norte)**, com rampas de inclinação suave e balcões de atendimento. Além disso, a **Sala Sensorial** fica no Corredor 1, oferecendo um ambiente tranquilo. Elevadores estão disponíveis em todos os corredores."
      },
      nyc_transit: {
        en: "🚍 **NYC Transit Connections**: The **Express Rail Transit** is operating normally with departures every 5 minutes and 0 minutes delay. The **Tournament Shuttle Bus** to NYC has a minor delay of 4 minutes. Carpool lots are currently at 88% capacity. We recommend taking the Express Rail to minimize emissions.",
        es: "🚍 **Conexiones de Tránsito de Nueva York**: El **Tren Expreso** opera normalmente con salidas cada 5 minutos y sin retraso. El **Autobús Lanzadera** a NYC presenta un retraso menor de 4 minutos. Los estacionamientos compartidos están al 88% de capacidad. Recomendamos el tren expreso para reducir emisiones.",
        fr: "🚍 **Transports vers NYC**: Le **Réseau Express Rail** fonctionne normalement avec des départs toutes les 5 minutes et 0 min de retard. La **Navette du Tournoi** vers NYC a un léger retard de 4 minutes. Le covoiturage est à 88% de capacité. Nous vous recommandons le train pour réduire vos émissions.",
        ar: "🚍 **اتصالات النقل إلى نيويورك**: يعمل **قطار السكك الحديدية السريع** بشكل طبيعي برحلات كل 5 دقائق وبدون أي تأخير. تواجه **حافلة البطولة** إلى نيويورك تأخيراً طفيفاً لمدة 4 دقائق. نوصي باستقلال القطار السريع لتقليل الانبعاثات الضارة.",
        de: "🚍 **ÖPNV-Verbindungen nach NYC**: Die **Express-Bahn** verkehrt planmäßig alle 5 Minuten ohne Verspätungen. Der **Turnier-Shuttlebus** nach NYC hat eine geringe Verspätung von 4 Minuten. Fahrgemeinschafts-Parkplätze sind zu 88% belegt. Wir empfehlen die Bahn zur Emissionsminderung.",
        ja: "🚍 **ニューヨーク方面の交通接続**: **エクスプレス・レール（快速電車）**は5分間隔で通常運行中（遅延なし）です。ニューヨーク行きの**大会シャトルバス**は4分の軽微な遅延が発生しています。相乗り駐車場は現在容量の88%です。排出量削減のため、電車の利用を推奨します。",
        pt: "🚍 **Conexões de Trânsito para NYC**: O **Trem Expresso** está operando normalmente com partidas a cada 5 minutos e sem atrasos. O **Ônibus Transbordo do Torneio** para NYC tem um pequeno atraso de 4 minutos. O estacionamento está com 88% de capacidade. Recomendamos o Trem Expresso para reduzir emissões."
      },
      sustainable_dining: {
        en: "🌱 **Sustainable & Organic Dining**: MetLife Stadium promotes zero-waste dining. You can order a plant-based burger or organic wrap at the **Concessions Green Hub (Block 105)**. Recycling compostable items here earns you a 20% discount on sustainable merchandise. Every green purchase saves 4.4 kg of CO2 compared to standard concessions.",
        es: "🌱 **Comida Sostenible y Orgánica**: El MetLife Stadium promueve una experiencia sin residuos. Puede pedir una hamburguesa vegana en el **Centro Verde de Concesiones (Bloque 105)**. Reciclar materiales compostables aquí le otorga 20% de descuento en mercadería oficial sostenible.",
        fr: "🌱 **Restauration Durable & Biologique**: Le MetLife Stadium favorise la réduction des déchets. Commandez un burger végétal au **Hub Vert (Bloc 105)**. Recycler vos emballages compostables ici vous permet d'obtenir 20% de réduction sur les produits durables du tournoi.",
        ar: "🌱 **خيارات طعام مستدامة وعضوية**: يروج استاد ميتلايف للأطعمة الخالية من النفايات. يمكنك طلب برجر نباتي أو لفائف عضوية من **مركز التنازلات الأخضر (قسم 105)**. تدوير المواد القابلة للتسميد هنا يمنحك خصماً بنسبة 20% على البضائع المستدامة.",
        de: "🌱 **Nachhaltige & Bio-Gastronomie**: Das MetLife Stadium fördert Zero-Waste-Gastronomie. Bestellen Sie einen pflanzlichen Burger am **Green Hub Stand (Block 105)**. Das Recyceln kompostierbarer Behälter bringt Ihnen 20% Rabatt auf nachhaltige Fanartikel.",
        ja: "🌱 **サステナブルフード＆オーガニックダイニング**: メットライフ・スタジアムではゼロ・ウェイストを推進しています。**グリーン・コンセッション・ハブ（105ブロック）**で植物由来のバーガーやオーガニックラップをご注文いただけます。生分解性容器をリサイクルするとサステナブルグッズが20%割引になります。",
        pt: "🌱 **Gastronomia Sustentável e Orgânica**: O MetLife Stadium promove alimentação com desperdício zero. Peça um hambúrguer vegetal no **Hub Verde de Concessões (Bloco 105)**. Reciclar itens compostáveis garante 20% de desconto em mercadorias sustentáveis."
      },
      general_help: {
        en: "⚽ **FIFA World Cup 2026 Assistant**: I can answer questions about match updates, seat blocks, toilet locations, safety regulations, and environmental features. Feel free to ask details such as 'Where is Medical Station 2?' or 'How congested is Gate D right now?'",
        es: "⚽ **Asistente de la Copa Mundial 2026**: Puedo responder sobre actualizaciones de partidos, asientos, baños, seguridad y medio ambiente. Pregunte detalles como '¿Dónde está la estación médica 2?' o '¿Qué tan congestionada está la Puerta D?'",
        fr: "⚽ **Assistant de la Coupe du Monde 2026**: Je peux répondre à vos questions sur les matchs, les blocs de sièges, les toilettes, la sécurité et l'environnement. Demandez-moi par exemple: 'Où est le poste médical 2?' ou 'Quel est l'attente à la porte D?'",
        ar: "⚽ **مساعد كأس العالم 2026**: يمكنني الإجابة على الأسئلة المتعلقة بآخر مباريات البطولة، مواقع المقاعد، دورات المياه، لوائح السلامة، والميزات البيئica. اسألني عن 'أين تقع المحطة الطبية 2؟' أو 'ما مدى ازدحام البوابة D الآن؟'",
        de: "⚽ **FIFA WM 2026 Assistent**: Ich beantworte Fragen zu Spielständen, Sitzblöcken, Toiletten, Sicherheitsregeln und Umweltthemen. Fragen Sie mich z. B. 'Wo ist die Sanitätsstation 2?' oder 'Wie voll ist Tor D zur Zeit?'",
        ja: "⚽ **FIFAワールドカップ2026 アシスタント**: 試合速報、座席エリア、トイレの場所、安全規則、エコの取り組みについてお答えします。「救護所2はどこですか？」や「現在ゲートDはどのくらい混雑していますか？」などお気軽にお尋ねください。",
        pt: "⚽ **Assistente da Copa do Mundo FIFA 2026**: Posso responder a perguntas sobre atualizações de jogos, blocos de assentos, banheiros, regulamentos de segurança e ecologia. Pergunte-me 'Onde fica o Posto Médico 2?' ou 'Quão congestionado está o Portão D?'"
      }
    };
  }

  // Classifies user query into pre-defined intents using keywords
  classifyIntent(query) {
    const q = query.toLowerCase();
    
    if (q.includes('wheelchair') || q.includes('accessible') || q.includes('accessibility') || q.includes('ramp') || q.includes('sensory') || q.includes('blind') || q.includes('disabled') || q.includes('ada')) {
      return 'accessibility_entrance';
    }
    if (q.includes('transit') || q.includes('shuttle') || q.includes('rail') || q.includes('train') || q.includes('bus') || q.includes('nyc') || q.includes('carpool') || q.includes('parking')) {
      return 'nyc_transit';
    }
    if (q.includes('organic') || q.includes('sustainable') || q.includes('concessions') || q.includes('carbon') || q.includes('food') || q.includes('burger') || q.includes('vegan') || q.includes('plant-based') || q.includes('recycle') || q.includes('emissions')) {
      return 'sustainable_dining';
    }
    return 'general_help';
  }

  /**
   * Generates dynamic AI response combining intent template and current simulator context values
   * @param {string} userQuery The string sent by user
   * @param {string} lang Target language code ('en', 'es', etc.)
   * @param {object} simulatorState Current state of the StadiumSimulator
   */
  generateResponse(userQuery, lang = 'en', simulatorState = {}) {
    const intent = this.classifyIntent(userQuery);
    let baseResponse = this.intentResponses[intent][lang] || this.intentResponses[intent]['en'];

    // Dynamic Context Injection based on current live state
    const gateDWait = simulatorState.gates ? simulatorState.gates['Gate D (West)'].waitTime : 18;
    const gateDStatus = simulatorState.gates ? simulatorState.gates['Gate D (West)'].status : 'Congested';
    
    // Supplement context depending on specific phrases in the query
    const q = userQuery.toLowerCase();
    
    if (q.includes('gate d') || q.includes('gate') || q.includes('queue') || q.includes('wait')) {
      const waitContext = {
        en: `\n\n📢 **Live Gate Sensor Alert**: Currently, **Gate D (West)** has an estimated wait time of **${gateDWait} minutes** (${gateDStatus}). Gates A, B, and C have less than 5 minutes queues. We advise entering through Gate A or B for rapid entry.`,
        es: `\n\n📢 **Alerta del Sensor de Puerta**: Actualmente, la **Puerta D (Oeste)** tiene una espera estimada de **${gateDWait} minutos** (${gateDStatus}). Las puertas A, B y C tienen filas menores a 5 minutos. Le recomendamos ingresar por la Puerta A o B.`,
        fr: `\n\n📢 **Alerte Capteur Porte**: Actuellement, la **Porte D (Ouest)** a un temps d'attente estimé de **${gateDWait} minutes** (${gateDStatus}). Les portes A, B et C ont moins de 5 min d'attente. Nous vous conseillons d'entrer par la Porte A ou B.`,
        ar: `\n\n📢 **تنبيه مستشعر البوابة الحي**: حالياً، تواجه **البوابة D (الغربية)** وقت انتظار تقديري يبلغ **${gateDWait} دقيقة** (${gateDStatus}). بينما تسجل البوابات A و B و C صفوفاً أقل من 5 دقائق. ننصح بالدخول عبر البوابات الأخرى للتوفير.`,
        de: `\n\n📢 **Live-Tor-Sensormeldung**: Aktuell hat **Tor D (West)** eine Wartezeit von ca. **${gateDWait} Minuten** (${gateDStatus}). Die Tore A, B und C weisen Wartezeiten unter 5 Minuten auf. Nutzen Sie Tor A oder B für schnelleren Einlass.`,
        ja: `\n\n📢 **ゲート混雑速報**: 現在、**ゲートD（西口）**の待ち時間は約**${gateDWait}分**（${gateDStatus}）です。ゲートA、B、Cは5分未満です。スムーズな入場のためにゲートAまたはBからの入場をお勧めします。`,
        pt: `\n\n📢 **Alerta de Sensor de Portão**: Atualmente, o **Portão D (Oeste)** tem um tempo de espera estimado de **${gateDWait} minutos** (${gateDStatus}). Os portões A, B e C têm filas de menos de 5 minutos.`
      };
      baseResponse += (waitContext[lang] || waitContext['en']);
    }

    if (q.includes('medical') || q.includes('aid') || q.includes('hurt') || q.includes('injury')) {
      const medicalContext = {
        en: `\n\n🏥 **First Aid Response**: Medical Station 2 is fully operational at **Concourse 1 near Gate D**. You can find certified EMTs there. If this is an immediate life safety emergency, please wave down the nearest safety volunteer wearing a high-visibility yellow FIFA jersey or press the Red Assist button.`,
        es: `\n\n🏥 **Servicio de Primeros Auxilios**: La estación médica 2 está operativa en la **Galería 1 cerca de la Puerta D**. Hay paramédicos listos. Si es una emergencia grave, alerte al voluntario de la FIFA más cercano o pulse el botón rojo de ayuda.`,
        fr: `\n\n🏥 **Premiers secours**: Le poste médical 2 est opérationnel sur le **Hall 1 près de la porte D**. En cas d'urgence absolue, veuillez interpeller le bénévole FIFA le plus proche ou appuyer sur le bouton d'assistance rouge.`,
        ar: `\n\n🏥 **الاستجابة للإسعافات الأولية**: المحطة الطبية 2 تعمل بكامل طاقتها في **البهو 1 بالقرب من البوابة D**. يمكنك العثور على مسعفين هناك. إذا كانت هذه حالة طارئة، يرجى إبلاغ أقرب متطوع أو الضغط على زر المساعدة الأحمر.`,
        de: `\n\n🏥 **Erste Hilfe**: Die Sanitätsstation 2 ist im **Korridor 1 nahe Tor D** voll besetzt. Wenn ein akuter Notfall vorliegt, sprechen Sie bitte sofort einen FIFA-Helfer in Leuchtkleidung an oder nutzen Sie den Notruf-Knopf.`,
        ja: `\n\n🏥 **救護対応**: 救護所2は**ゲートD近くのコンコース1**で稼働中です。救急救命士が常駐しています。緊急の場合は、黄色の高視認性ベストを着用したお近くのFIFAボランティアを呼ぶか、緊急アシストボタンを押してください。`,
        pt: `\n\n pt 🏥 **Primeiros Socorros**: O Posto Médico 2 está funcionando no **Corredor 1 perto do Portão D**. Existem paramédicos certificados. Em caso de emergência, avise o voluntário FIFA mais próximo.`
      };
      baseResponse += (medicalContext[lang] || medicalContext['en']);
    }

    return baseResponse;
  }

  // Generates AI Tactical briefing for Operations Center (Staff Mode)
  generateTacticalResponse(incidentTarget, simulatorState) {
    if (incidentTarget === 'Gate D (West)') {
      return `📊 **AI Tactical Dispatch (Gate D Congestion)**:
1. **Rerouting**: Injecting navigation notices to fans inside 2-mile radius advising Gate A or B access.
2. **Staff Dispatch**: Dispatched 6 mobile operations volunteers to concourse D outer security corridor.
3. **Queue Balancing**: Activated alternative queuing lane lanes D4-D7.
Estimated time to relieve: **8 minutes** under current dispatch guidelines.`;
    }
    
    if (incidentTarget === 'Gate C (South)') {
      return `📊 **AI Tactical Dispatch (Gate C Transit Surge)**:
1. **Rerouting**: Activating overhead signage in the Express Rail Station to delay platform exits.
2. **Staff Dispatch**: Repositioning 4 volunteers from VIP Zone to south check-points.
3. **Information**: Emitting push notifications in Spanish & English to transit commuters.`;
    }

    if (incidentTarget === 'Medical Station 2 - Gate D') {
      return `🚑 **AI Tactical Dispatch (Medical Call Section 118)**:
1. **Dispatch**: Alerted EMT Unit 2 located at Gate D station. Responders deployed with emergency stretcher.
2. **Access Route**: Cleared wheelchair lane route A4 for responder egress.
3. **Logistics**: Estimated arrival at Section 118: **2 min 40 seconds**. Target tracking live.`;
    }

    if (incidentTarget === 'Concessions Green Hub - Block 105') {
      return `🍔 **AI Tactical Dispatch (Concessions POS Slowdown)**:
1. **POS Audit**: Re-routed POS network load to secondary wireless channels.
2. **Voucher incentive**: Emitted 15% discount vouchers for surrounding sustainable carts (Blocks 102 & 109) to spread consumer traffic.`;
    }

    return "System status is nominal. No tactical dispatch overrides required.";
  }

  // Dynamic text streaming into a target element with word-by-word delays
  streamText(text, element, onCompleteCallback) {
    element.innerHTML = "";
    element.classList.add('streaming');
    
    const words = text.split(" ");
    let i = 0;
    
    const timer = setInterval(() => {
      if (i < words.length) {
        // Safe text appending to prevent XSS
        const span = document.createElement('span');
        // Handle basic bold syntax markdown for neat typography
        let word = words[i];
        if (word.startsWith('**') && word.endsWith('**')) {
          span.style.fontWeight = 'bold';
          span.textContent = word.replace(/\*\*/g, '') + ' ';
        } else if (word.startsWith('**')) {
          span.style.fontWeight = 'bold';
          span.textContent = word.replace(/^\*\*/, '') + ' ';
        } else if (word.endsWith('**')) {
          span.style.fontWeight = 'bold';
          span.textContent = word.replace(/\*\*$/, '') + ' ';
        } else {
          span.textContent = word + ' ';
        }
        element.appendChild(span);
        element.scrollTop = element.scrollHeight;
        i++;
      } else {
        clearInterval(timer);
        element.classList.remove('streaming');
        if (onCompleteCallback) onCompleteCallback();
      }
    }, 45); // Speed adjustment for smooth reading
  }
}

// Instantiate engine globally
window.stadiumAIEngine = new StadiumAIEngine();

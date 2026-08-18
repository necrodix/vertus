const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const header = $('#siteHeader');
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
const form = $('#diagnosisForm');
const status = $('#formStatus');
const langToggle = $('#langToggle');

const updateHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('hashchange', () => window.requestAnimationFrame(updateHeaderState));
window.addEventListener('pageshow', () => window.requestAnimationFrame(updateHeaderState));
window.addEventListener('load', () => window.requestAnimationFrame(updateHeaderState));
updateHeaderState();

const hero = $('.hero');
const heroMedia = $('.hero-media', hero);
const heroFadeTargets = $$('.hero-copy, .hero-pillars', hero);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let heroFrame = null;
function updateHeroFade() {
  if (!hero || reduceMotion) return;
  const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight * 0.7, 1), 1);
  const contentOpacity = 1 - progress * 0.88;
  heroFadeTargets.forEach(el => { el.style.opacity = String(contentOpacity); });
  if (heroMedia) heroMedia.style.opacity = String(1 - progress * 0.42);
  heroFrame = null;
}
window.addEventListener('scroll', () => {
  if (!heroFrame) heroFrame = window.requestAnimationFrame(updateHeroFade);
}, { passive: true });
updateHeroFade();

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

const submenuGroups = $$('.nav-group', mainNav);
const closeSubmenus = (except = null) => {
  submenuGroups.forEach(group => {
    if (group === except) return;
    group.classList.remove('is-open');
    $('.nav-trigger', group)?.setAttribute('aria-expanded', 'false');
  });
};

submenuGroups.forEach(group => {
  const trigger = $('.nav-trigger', group);
  trigger.addEventListener('click', event => {
    event.stopPropagation();
    const willOpen = !group.classList.contains('is-open');
    closeSubmenus(group);
    group.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
});

document.addEventListener('click', event => {
  if (!mainNav.contains(event.target)) closeSubmenus();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeSubmenus();
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  }
});

$$('#mainNav a').forEach(a => a.addEventListener('click', () => {
  closeSubmenus();
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });
$$('.reveal').forEach(el => observer.observe(el));

const stagedSections = $$('.challenge-intro, .problem-section');
const stagedObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-active');
      stagedObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -45px' });
stagedSections.forEach(section => stagedObserver.observe(section));

const timeline = $('.timeline');
if (timeline) {
  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.28, rootMargin: '0px 0px -70px' });
  timelineObserver.observe(timeline);
}

document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';
  const required = $$('[required]', form);
  let valid = true;
  required.forEach(el => {
    const isCheckbox = el.type === 'checkbox';
    const ok = isCheckbox ? el.checked : el.checkValidity();
    el.classList.toggle('invalid', !ok && !isCheckbox);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = currentLang === 'es' ? 'Revisa los campos obligatorios antes de continuar.' : 'Please review the required fields before continuing.';
    status.classList.add('error');
    return;
  }
  const button = $('button[type="submit"]', form);
  button.disabled = true;
  button.textContent = currentLang === 'es' ? 'Procesando…' : 'Processing…';
  setTimeout(() => {
    status.textContent = currentLang === 'es'
      ? 'Formulario validado. Falta conectar el endpoint de envío antes de publicar.'
      : 'Form validated. The submission endpoint still needs to be connected before publishing.';
    status.classList.add('success');
    button.disabled = false;
    button.textContent = t[currentLang]['form.submit'];
  }, 700);
});

const t = {
  es: {
    'nav.home':'Inicio','nav.solutions':'Soluciones','nav.solutionsOverview':'Vista general de soluciones','nav.liquidity':'Liquidez & Financiamiento','nav.risk':'Gestión Estratégica de Riesgos','nav.consulting':'Consultoría Empresarial Integral','nav.about':'Quiénes somos','nav.aboutOverview':'Quiénes somos','nav.mission':'Misión','nav.vision':'Visión','nav.values':'Nuestros valores','nav.why':'Por qué Virtus','nav.method':'Metodología','nav.diagnosis':'Solicitar diagnóstico',
    'transition.lead':'Tu reto financiero','transition.title':'es el punto de partida.','transition.credit':'Crédito','transition.flow':'Flujo','transition.capital':'Capital','transition.fx':'Riesgo FX','transition.control':'Control',
    'hero.line1':'Protegemos tu liquidez.','hero.line2':'Reducimos tu riesgo.','hero.line3':'Impulsamos tu crecimiento.','hero.body':'Liquidez, financiamiento, gestión de riesgos y consultoría para empresas que necesitan decisiones financieras de alto nivel.',
    'cta.diagnosis':'Solicitar diagnóstico','cta.solutions':'Ver soluciones','cta.challenges':'¿Qué necesita resolver tu empresa?','pillars.liquidity':'Liquidez','pillars.protection':'Protección','pillars.growth':'Crecimiento',
    'resolve.eyebrow':'PRIMERO, TU RETO','resolve.title':'¿Qué necesita resolver tu empresa?','resolve.body':'Identifica la situación que más se parece a tu realidad. Desde ahí te llevamos a la solución adecuada.',
    'resolve.card1.title':'El banco no autoriza tu crédito','resolve.card1.body':'Revisamos estructura, capacidad y alternativas de financiamiento.','resolve.card2.title':'Tu deuda de corto plazo presiona el flujo','resolve.card2.body':'Analizamos consolidación y reestructuración de pasivos.','resolve.card3.title':'Necesitas capital de trabajo','resolve.card3.body':'Diseñamos estructura para fortalecer liquidez operativa.','resolve.card4.title':'El tipo de cambio afecta tus márgenes','resolve.card4.body':'Evaluamos coberturas para reducir exposición cambiaria.','resolve.card5.title':'Necesitas mayor control financiero','resolve.card5.body':'Integramos finanzas, fiscal, contabilidad, auditoría y control.',
    'solutions.title':'Tres rutas. Una estrategia financiera integral.','solutions.body':'Profundiza en el eje que tu empresa necesita sin perder la visión completa del negocio.','solutions.s1.title':'Liquidez & Financiamiento','solutions.s1.body':'Capital de trabajo, pasivos, crédito empresarial, liquidez y líneas FX & Capital.','solutions.s2.title':'Gestión Estratégica de Riesgos','solutions.s2.body':'Divisas, forwards, opciones, derivados y estructuras avanzadas ante la volatilidad.','solutions.s3.title':'Consultoría Empresarial Integral','solutions.s3.body':'Finanzas, contabilidad, fiscal, auditoría, gobierno corporativo y control interno.','common.more':'Ver más →',
    'hub.title':'Tu HUB de ingeniería financiera','hub.lead':'Financiamiento + Tesorería + Riesgos + Consultoría integrados en una sola estrategia.','hub.body':'No vendemos productos. Diseñamos estructuras financieras y acompañamos su ejecución.','hub.cta':'Conoce cómo trabajamos','hub.step1':'Analizamos','hub.step1body':'Balance, flujo, deuda y exposición.','hub.step2':'Estructuramos','hub.step2body':'La estructura financiera adecuada.','hub.step3':'Negociamos','hub.step3body':'Con instituciones y aliados especializados.','hub.step4':'Implementamos','hub.step4body':'Con seguimiento y ajustes continuos.',
    'about.eyebrow':'QUIÉNES SOMOS','about.title':'Criterio financiero para transformar riesgos en oportunidades.','about.body':'Virtus Advisory Partners integra experiencia en financiamiento, tesorería, riesgos y consultoría para diseñar y ejecutar soluciones con visión de largo plazo.','about.mission':'Misión','about.missionBody':'Diseñar soluciones financieras estratégicas que protejan la operación, fortalezcan la liquidez y habiliten el crecimiento de nuestros clientes.','about.vision':'Visión','about.visionBody':'Ser el HUB de ingeniería financiera de referencia para empresas que buscan decisiones sólidas, acompañamiento experto y resultados sostenibles.','about.valuesEyebrow':'NUESTROS VALORES','about.valuesTitle':'Cuatro pilares que orientan cada decisión.','about.v1':'Templanza','about.v1Body':'Equilibrio y serenidad para decidir con claridad.','about.v2':'Fortaleza','about.v2Body':'Determinación para ejecutar incluso en escenarios complejos.','about.v3':'Prudencia y sabiduría','about.v3Body':'Análisis riguroso antes de recomendar y actuar.','about.v4':'Justicia','about.v4Body':'Integridad, transparencia y equilibrio en cada relación.',
    'financing.title':'Capital inteligente para impulsar tu operación.','financing.i1':'Crédito empresarial','financing.i2':'Capital de trabajo','financing.i3':'Consolidación de pasivos','financing.i4':'Reestructuración','financing.i5':'Financiamiento operativo','financing.i6':'Líneas FX & Capital',
    'risk.title':'Blindamos tu empresa ante la volatilidad.','risk.i1':'Mercado de divisas','risk.i2':'Forwards y opciones','risk.i3':'Derivados financieros','risk.i4':'Estructuras avanzadas',
    'consulting.title':'Expertos que impulsan decisiones, orden y crecimiento.','consulting.i1':'Finanzas','consulting.i2':'Contabilidad','consulting.i3':'Fiscal','consulting.i4':'Auditoría','consulting.i5':'Gobierno corporativo','consulting.i6':'Control interno',
    'why.years':'años de experiencia','why.title':'Confianza antes de hablar de productos.','why.t1':'Experiencia especializada','why.b1':'Trayectoria ejecutiva en banca, tesorería y mercados.','why.t2':'Mesas de mercado','why.b2':'Experiencia práctica en divisas, líneas FX, tasas y derivados.','why.t3':'Alianzas estratégicas','why.b3':'Red de firmas e instituciones financieras especializadas.','why.t4':'Enfoque 360°','why.b4':'Estructura, negociación y ejecución integradas.',
    'method.title':'Un proceso que se entiende en segundos.','method.quote':'“No vendemos productos. Diseñamos soluciones estratégicas.”','method.m1':'Diagnóstico','method.mb1':'Analizamos tu situación financiera, riesgos y oportunidades.','method.m2':'Estrategia','method.mb2':'Diseñamos la estrategia financiera y de gestión de riesgos.','method.m3':'Implementación','method.mb3':'Ejecutamos con precisión y acompañamiento experto.','method.m4':'Seguimiento','method.mb4':'Monitoreamos y ajustamos para sostener resultados.',
    'cases.title':'Hacemos tangible el valor antes del diagnóstico.','cases.note':'Ejemplos de estructura comercial. Los casos y cifras reales se incorporarán únicamente después de la aprobación de Virtus.','cases.challenge':'Reto','cases.intervention':'Intervención','cases.outcome':'Resultado esperado','cases.c1':'Empresa importadora','cases.c1a':'Exposición cambiaria que presiona márgenes.','cases.c1b':'Cobertura FX + estrategia de tesorería.','cases.c1c':'Mayor certidumbre sobre costos futuros.','cases.c2':'Empresa con deuda de corto plazo','cases.c2a':'Pasivos que presionan el flujo operativo.','cases.c2b':'Consolidación y reestructuración financiera.','cases.c2c':'Mejor perfil de vencimientos y flexibilidad.','cases.c3':'Empresa en crecimiento','cases.c3a':'Necesidad de capital para sostener la operación.','cases.c3b':'Capital de trabajo + estructura financiera.','cases.c3c':'Mayor capacidad para ejecutar el crecimiento.',
    'diagnosis.title':'Convirtamos tu reto financiero en una estrategia.','diagnosis.body':'Cuéntanos brevemente qué necesita resolver tu empresa. El formulario nos ayuda a preparar una conversación más útil.','diagnosis.contact':'Contacto',
    'form.name':'Nombre','form.company':'Empresa','form.email':'Correo','form.phone':'Teléfono','form.need':'¿Qué necesita resolver?','form.choose':'Selecciona una opción','form.o1':'Liquidez / Financiamiento','form.o2':'Riesgo cambiario / Mercado','form.o3':'Consultoría empresarial','form.o4':'Otro','form.billing':'Facturación aproximada','form.billingPlaceholder':'Indica una cifra o rango aproximado','form.privacy':'Acepto que mis datos sean utilizados para dar seguimiento a mi solicitud. El aviso de privacidad definitivo deberá vincularse antes de publicar.','form.submit':'Solicitar diagnóstico financiero','footer.tagline':'HUB de ingeniería financiera.'
  },
  en: {
    'nav.home':'Home','nav.solutions':'Solutions','nav.solutionsOverview':'Solutions overview','nav.liquidity':'Liquidity & Financing','nav.risk':'Strategic Risk Management','nav.consulting':'Comprehensive Business Consulting','nav.about':'About us','nav.aboutOverview':'About us','nav.mission':'Mission','nav.vision':'Vision','nav.values':'Our values','nav.why':'Why Virtus','nav.method':'Methodology','nav.diagnosis':'Request assessment',
    'transition.lead':'Your financial challenge','transition.title':'is the starting point.','transition.credit':'Credit','transition.flow':'Cash flow','transition.capital':'Capital','transition.fx':'FX risk','transition.control':'Control',
    'hero.line1':'We protect your liquidity.','hero.line2':'We reduce your risk.','hero.line3':'We drive your growth.','hero.body':'Liquidity, financing, risk management and consulting for companies that need high-level financial decisions.',
    'cta.diagnosis':'Request an assessment','cta.solutions':'View solutions','cta.challenges':'What does your company need to solve?','pillars.liquidity':'Liquidity','pillars.protection':'Protection','pillars.growth':'Growth',
    'resolve.eyebrow':'FIRST, YOUR CHALLENGE','resolve.title':'What does your company need to solve?','resolve.body':'Identify the situation closest to your reality. From there, we guide you to the right solution.',
    'resolve.card1.title':'The bank did not approve your credit','resolve.card1.body':'We review structure, capacity and financing alternatives.','resolve.card2.title':'Short-term debt is pressuring cash flow','resolve.card2.body':'We analyze liability consolidation and restructuring.','resolve.card3.title':'You need working capital','resolve.card3.body':'We design structures to strengthen operating liquidity.','resolve.card4.title':'FX is affecting your margins','resolve.card4.body':'We assess hedging strategies to reduce currency exposure.','resolve.card5.title':'You need stronger financial control','resolve.card5.body':'We integrate finance, tax, accounting, audit and controls.',
    'solutions.title':'Three paths. One integrated financial strategy.','solutions.body':'Explore the area your company needs without losing sight of the full business picture.','solutions.s1.title':'Liquidity & Financing','solutions.s1.body':'Working capital, liabilities, corporate credit, liquidity and FX & Capital lines.','solutions.s2.title':'Strategic Risk Management','solutions.s2.body':'FX, forwards, options, derivatives and advanced structures for volatile markets.','solutions.s3.title':'Integrated Business Consulting','solutions.s3.body':'Finance, accounting, tax, audit, corporate governance and internal control.','common.more':'Learn more →',
    'hub.title':'Your financial engineering HUB','hub.lead':'Financing + Treasury + Risk + Consulting integrated into one strategy.','hub.body':'We do not sell products. We design financial structures and support execution.','hub.cta':'See how we work','hub.step1':'Analyze','hub.step1body':'Balance sheet, cash flow, debt and exposure.','hub.step2':'Structure','hub.step2body':'The right financial structure.','hub.step3':'Negotiate','hub.step3body':'With institutions and specialized partners.','hub.step4':'Implement','hub.step4body':'With ongoing monitoring and adjustments.',
    'about.eyebrow':'ABOUT US','about.title':'Financial judgment to transform risks into opportunities.','about.body':'Virtus Advisory Partners brings together expertise in financing, treasury, risk and consulting to design and execute solutions with a long-term perspective.','about.mission':'Mission','about.missionBody':'To design strategic financial solutions that protect operations, strengthen liquidity and enable our clients’ growth.','about.vision':'Vision','about.visionBody':'To be the leading financial engineering HUB for companies seeking sound decisions, expert guidance and sustainable results.','about.valuesEyebrow':'OUR VALUES','about.valuesTitle':'Four pillars that guide every decision.','about.v1':'Temperance','about.v1Body':'Balance and composure to make clear decisions.','about.v2':'Fortitude','about.v2Body':'Determination to execute even in complex scenarios.','about.v3':'Prudence and wisdom','about.v3Body':'Rigorous analysis before recommending and acting.','about.v4':'Justice','about.v4Body':'Integrity, transparency and balance in every relationship.',
    'financing.title':'Smart capital to power your operation.','financing.i1':'Corporate credit','financing.i2':'Working capital','financing.i3':'Liability consolidation','financing.i4':'Restructuring','financing.i5':'Operating financing','financing.i6':'FX & Capital lines',
    'risk.title':'We protect your company from volatility.','risk.i1':'Foreign exchange','risk.i2':'Forwards and options','risk.i3':'Financial derivatives','risk.i4':'Advanced structures',
    'consulting.title':'Experts who drive decisions, order and growth.','consulting.i1':'Finance','consulting.i2':'Accounting','consulting.i3':'Tax','consulting.i4':'Audit','consulting.i5':'Corporate governance','consulting.i6':'Internal control',
    'why.years':'years of experience','why.title':'Trust before products.','why.t1':'Specialized experience','why.b1':'Executive track record in banking, treasury and markets.','why.t2':'Market desks','why.b2':'Hands-on experience in FX, credit lines, rates and derivatives.','why.t3':'Strategic alliances','why.b3':'Network of specialized firms and financial institutions.','why.t4':'360° approach','why.b4':'Integrated structuring, negotiation and execution.',
    'method.title':'A process you can understand in seconds.','method.quote':'“We do not sell products. We design strategic solutions.”','method.m1':'Assessment','method.mb1':'We analyze your financial position, risks and opportunities.','method.m2':'Strategy','method.mb2':'We design the financial and risk-management strategy.','method.m3':'Implementation','method.mb3':'We execute with precision and expert support.','method.m4':'Monitoring','method.mb4':'We monitor and adjust to sustain results.',
    'cases.title':'Making value tangible before the assessment.','cases.note':'Commercial structure examples only. Real cases and figures will be added only after Virtus approval.','cases.challenge':'Challenge','cases.intervention':'Intervention','cases.outcome':'Expected outcome','cases.c1':'Importing company','cases.c1a':'FX exposure pressuring margins.','cases.c1b':'FX hedge + treasury strategy.','cases.c1c':'Greater certainty over future costs.','cases.c2':'Company with short-term debt','cases.c2a':'Liabilities pressuring operating cash flow.','cases.c2b':'Financial consolidation and restructuring.','cases.c2c':'Improved maturity profile and flexibility.','cases.c3':'Growing company','cases.c3a':'Capital needs to sustain operations.','cases.c3b':'Working capital + financial structure.','cases.c3c':'Greater ability to execute growth.',
    'diagnosis.title':'Turn your financial challenge into a strategy.','diagnosis.body':'Tell us briefly what your company needs to solve. This form helps us prepare a more useful conversation.','diagnosis.contact':'Contact',
    'form.name':'Name','form.company':'Company','form.email':'Email','form.phone':'Phone','form.need':'What do you need to solve?','form.choose':'Choose an option','form.o1':'Liquidity / Financing','form.o2':'FX / Market risk','form.o3':'Business consulting','form.o4':'Other','form.billing':'Approximate revenue','form.billingPlaceholder':'Enter an approximate figure or range','form.privacy':'I agree that my information may be used to follow up on my request. The final privacy notice must be linked before publishing.','form.submit':'Request financial assessment','footer.tagline':'Financial engineering HUB.'
  }
};
let currentLang = 'es';
function setLanguage(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[lang][key]) el.textContent = t[lang][key];
  });
  $$('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[lang][key]) el.placeholder = t[lang][key];
  });
  langToggle.textContent = lang === 'es' ? 'EN' : 'ES';
  menuToggle.setAttribute('aria-label', lang === 'es' ? 'Abrir menú' : 'Open menu');
}
langToggle.addEventListener('click', () => setLanguage(currentLang === 'es' ? 'en' : 'es'));

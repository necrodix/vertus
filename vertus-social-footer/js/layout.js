const siteHeader = `
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <header class="site-header" id="siteHeader">
    <div class="container nav-wrap">
      <a class="brand" href="index.html" aria-label="Virtus Advisory Partners - Inicio"><img class="brand-logo" src="images/LOGO.svg" alt="Virtus Advisory Partners"></a>
      <button class="menu-toggle" id="menuToggle" aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span><span></span></button>
      <nav class="main-nav" id="mainNav" aria-label="Navegación principal">
        <a href="index.html" data-i18n="nav.home">Inicio</a>
        <div class="nav-group">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="solutionsMenu"><span data-i18n="nav.solutions">Soluciones</span><span class="nav-chevron" aria-hidden="true"></span></button>
          <div class="submenu" id="solutionsMenu">
            <a href="soluciones.html" data-i18n="nav.solutionsOverview">Vista general de soluciones</a>
            <a href="liquidez-financiamiento.html" data-i18n="nav.liquidity">Liquidez &amp; Financiamiento</a>
            <a href="gestion-riesgos.html" data-i18n="nav.risk">Gestión Estratégica de Riesgos</a>
            <a href="consultoria-empresarial.html" data-i18n="nav.consulting">Consultoría Empresarial Integral</a>
          </div>
        </div>
        <div class="nav-group">
          <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="aboutMenu"><span data-i18n="nav.about">Quiénes somos</span><span class="nav-chevron" aria-hidden="true"></span></button>
          <div class="submenu" id="aboutMenu">
            <a href="quienes-somos.html#quienes" data-i18n="nav.aboutOverview">Quiénes somos</a>
            <a href="quienes-somos.html#mision" data-i18n="nav.mission">Misión</a>
            <a href="quienes-somos.html#vision" data-i18n="nav.vision">Visión</a>
            <a href="quienes-somos.html#valores" data-i18n="nav.values">Nuestros valores</a>
          </div>
        </div>
        <a href="por-que-virtus.html" data-i18n="nav.why">Por qué Virtus</a>
        <a href="metodologia.html" data-i18n="nav.method">Metodología</a>
        <a class="nav-cta" href="diagnostico.html" data-i18n="nav.diagnosis">Solicitar diagnóstico</a>
        <div class="language-switcher" role="group" aria-label="Selector de idioma">
          <button class="lang-option is-active" type="button" data-lang="es" aria-pressed="true">ES</button>
          <span class="lang-separator" aria-hidden="true">/</span>
          <button class="lang-option" type="button" data-lang="en" aria-pressed="false">EN</button>
        </div>
      </nav>
    </div>
  </header>`;

const siteFooter = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <a class="brand footer-brand" href="index.html"><img class="brand-logo" src="images/LOGO.svg" alt="Virtus Advisory Partners"></a>
      <div class="footer-meta">
        <p>© <span id="year"></span> Virtus Advisory Partners</p>
        <nav class="social-links" aria-label="Redes sociales">
          <a href="https://www.linkedin.com/company/virtusadp" target="_blank" rel="noopener noreferrer" aria-label="Virtus en LinkedIn"><img src="images/icons/SVG/social_linkedin.svg" alt="" aria-hidden="true"></a>
          <a href="https://www.instagram.com/virtusadp" target="_blank" rel="noopener noreferrer" aria-label="Virtus en Instagram"><img src="images/icons/SVG/social_instagram.svg" alt="" aria-hidden="true"></a>
          <a href="https://www.facebook.com/virtusadp" target="_blank" rel="noopener noreferrer" aria-label="Virtus en Facebook"><img src="images/icons/SVG/social_facebook.svg" alt="" aria-hidden="true"></a>
        </nav>
      </div>
    </div>
  </footer>`;

document.body.insertAdjacentHTML('afterbegin', siteHeader);
document.body.insertAdjacentHTML('beforeend', siteFooter);

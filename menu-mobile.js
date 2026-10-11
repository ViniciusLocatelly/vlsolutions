/* VLSolutions: menu de navegação no celular.
   Em telas de até 960px o menu do topo some; este script coloca um botão de menu
   ao lado de "Solicitar orçamento" e abre a lista de links num painel abaixo da barra. */
(function () {
  var nav = document.querySelector('nav');
  var lista = nav && nav.querySelector('.nav-links');
  if (!nav || !lista || nav.querySelector('.vls-menu-btn')) return;

  var css = document.createElement('style');
  css.textContent =
    '.vls-menu-btn{display:none;align-items:center;justify-content:center;width:44px;height:44px;margin-left:10px;' +
    'background:transparent;border:1px solid rgba(184,137,42,.55);border-radius:6px;cursor:pointer;padding:0;flex-shrink:0}' +
    '.vls-menu-btn span,.vls-menu-btn span:before,.vls-menu-btn span:after{display:block;width:20px;height:2px;background:#D4A843;' +
    'position:relative;transition:transform .2s,background .2s}' +
    '.vls-menu-btn span:before,.vls-menu-btn span:after{content:"";position:absolute;left:0}' +
    '.vls-menu-btn span:before{top:-6px}.vls-menu-btn span:after{top:6px}' +
    '.vls-menu-btn[aria-expanded="true"] span{background:transparent}' +
    '.vls-menu-btn[aria-expanded="true"] span:before{transform:translateY(6px) rotate(45deg)}' +
    '.vls-menu-btn[aria-expanded="true"] span:after{transform:translateY(-6px) rotate(-45deg)}' +
    '.vls-menu-painel{display:none;position:fixed;left:0;right:0;z-index:99;background:#0D0D0D;' +
    'border-top:1px solid rgba(184,137,42,.35);padding:8px 0 16px;max-height:calc(100vh - 70px);overflow-y:auto}' +
    '.vls-menu-painel.aberto{display:block}' +
    '.vls-menu-painel a{display:block;padding:14px 24px;color:rgba(255,255,255,.85);text-decoration:none;' +
    'font-family:"DM Sans",sans-serif;font-size:16px;border-bottom:1px solid rgba(255,255,255,.06)}' +
    '.vls-menu-painel a:active,.vls-menu-painel a:hover,.vls-menu-painel a.ativo{color:#D4A843}' +
    '@media(max-width:960px){.vls-menu-btn{display:inline-flex}}' +
    '@media(max-width:420px){nav .nav-cta{padding-left:12px!important;padding-right:12px!important;font-size:12px!important}}';
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'vls-menu-btn';
  btn.setAttribute('aria-label', 'Abrir menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span>';
  nav.appendChild(btn);

  var painel = document.createElement('div');
  painel.className = 'vls-menu-painel';
  painel.setAttribute('role', 'menu');
  lista.querySelectorAll('a').forEach(function (a) {
    var c = a.cloneNode(true);
    c.setAttribute('role', 'menuitem');
    painel.appendChild(c);
  });
  document.body.appendChild(painel);

  function posicionar() { painel.style.top = nav.getBoundingClientRect().bottom + 'px'; }
  function fechar() {
    painel.classList.remove('aberto');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
  }
  btn.addEventListener('click', function () {
    var abrir = !painel.classList.contains('aberto');
    if (!abrir) return fechar();
    posicionar();
    painel.classList.add('aberto');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fechar menu');
  });
  painel.addEventListener('click', function (e) { if (e.target.closest('a')) fechar(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) fechar(); else posicionar(); });
})();

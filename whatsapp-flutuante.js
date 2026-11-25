/* VLSolutions: botão flutuante de WhatsApp, presente em todas as páginas.
   No computador aparece como pílula "Fale com o engenheiro"; no celular, só o ícone.
   A mensagem já sai preenchida com a página de origem, para o atendimento saber o assunto.
   O clique é medido pelo analytics.js (evento contato_whatsapp), pois o link usa wa.me. */
(function () {
  if (document.querySelector('.vls-wa')) return;
  var NUMERO = '5527995027411';

  var css = document.createElement('style');
  css.textContent =
    '.vls-wa{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9990;' +
    'display:flex;align-items:center;gap:10px;height:58px;padding:0 22px 0 18px;border-radius:29px;' +
    'background:#25D366;color:#fff;text-decoration:none;font:600 15px "DM Sans",Arial,sans-serif;' +
    'box-shadow:0 6px 22px rgba(0,0,0,.28);transition:transform .2s,box-shadow .2s,bottom .3s}' +
    '.vls-wa:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.34)}' +
    '.vls-wa:focus-visible{outline:3px solid #D4A843;outline-offset:3px}' +
    '.vls-wa svg{width:28px;height:28px;flex-shrink:0}' +
    '.vls-wa:before{content:"";position:absolute;inset:0;border-radius:inherit;border:2px solid #25D366;' +
    'animation:vlsWaPulso 2.4s ease-out infinite;pointer-events:none}' +
    '@keyframes vlsWaPulso{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.25)}}' +
    '.vls-wa.sobe{bottom:calc(170px + env(safe-area-inset-bottom,0px))}' +
    '@media(max-width:960px){.vls-wa{width:58px;padding:0;justify-content:center;right:16px}.vls-wa span{display:none}}' +
    '@media(prefers-reduced-motion:reduce){.vls-wa:before{animation:none;display:none}}' +
    '@media print{.vls-wa{display:none}}';
  document.head.appendChild(css);

  var h1 = document.querySelector('h1');
  var raiz = location.pathname === '/' || location.pathname === '/index.html';
  var assunto = !raiz && h1 ? (h1.innerText || h1.textContent).replace(/\s+/g, ' ').trim().slice(0, 90) : '';
  var msg = 'Olá, Vinicius! Vim pelo site da VLSolutions' + (assunto ? ' (' + assunto + ')' : '') +
    ' e gostaria de falar com o engenheiro.';

  var a = document.createElement('a');
  a.className = 'vls-wa';
  a.href = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(msg);
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Falar com o engenheiro no WhatsApp');
  a.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>' +
    '<span>Fale com o engenheiro</span>';

  function montar() {
    document.body.appendChild(a);
    /* Enquanto o aviso de cookies estiver na tela, o botão sobe para não ficar por baixo dele. */
    var ajustar = function () { a.classList.toggle('sobe', !!document.querySelector('.vls-ck')); };
    ajustar();
    if (window.MutationObserver) new MutationObserver(ajustar).observe(document.body, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

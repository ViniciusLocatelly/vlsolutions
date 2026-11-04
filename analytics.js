/* VLSolutions: medição de visitas (Google Analytics 4) com consentimento (LGPD).

   COMO ATIVAR: troque o valor de GA_ID abaixo pelo ID de medição do seu GA4
   (formato G-XXXXXXXXXX). Enquanto estiver com o valor de exemplo, nada é carregado
   e o aviso de cookies não aparece.

   Como funciona:
   - Antes da escolha do visitante, o GA4 roda em modo de consentimento negado:
     não grava cookie, só envia sinais anônimos.
   - "Aceitar" libera a medição completa. "Recusar" mantém o modo anônimo.
   - Publicidade fica sempre negada (o site não faz anúncios).
   - Registra como eventos: clique no WhatsApp e envio do formulário de orçamento. */
(function () {
  var GA_ID = 'G-49QP71615W';
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;

  var CHAVE = 'vls-consentimento';
  var escolha = null;
  try { escolha = localStorage.getItem(CHAVE); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: escolha === 'aceito' ? 'granted' : 'denied'
  });
  gtag('js', new Date());
  gtag('config', GA_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  /* Eventos de contato: são os indicadores que interessam (lead por canal). */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/wa\.me|api\.whatsapp\.com/.test(href)) {
      gtag('event', 'contato_whatsapp', { pagina: location.pathname });
    } else if (/^mailto:/.test(href)) {
      gtag('event', 'contato_email', { pagina: location.pathname });
    } else if (/^tel:/.test(href)) {
      gtag('event', 'contato_telefone', { pagina: location.pathname });
    }
  }, true);
  document.addEventListener('submit', function () {
    gtag('event', 'formulario_orcamento', { pagina: location.pathname });
  }, true);

  if (escolha === 'aceito' || escolha === 'recusado') return;

  /* Aviso de cookies */
  function montarAviso() {
    var css = document.createElement('style');
    css.textContent =
      '.vls-ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#111;color:#e8e4dc;border:1px solid #B7892D;border-radius:10px;padding:16px 18px;' +
      'font:400 14px/1.5 "DM Sans",Arial,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.35)}' +
      '.vls-ck p{margin:0 0 12px}.vls-ck a{color:#d9b25c}' +
      '.vls-ck .b{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
      '.vls-ck button{font:600 13px "DM Sans",Arial,sans-serif;border-radius:6px;padding:9px 16px;cursor:pointer}' +
      '.vls-ck .s{background:#B7892D;color:#111;border:1px solid #B7892D}' +
      '.vls-ck .n{background:transparent;color:#e8e4dc;border:1px solid #555}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.className = 'vls-ck';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Usamos cookies do Google Analytics para medir as visitas e melhorar o site. ' +
      'Nada é usado para publicidade. <a href="/politica-de-privacidade.html">Política de privacidade</a>.</p>' +
      '<div class="b"><button type="button" class="n">Recusar</button>' +
      '<button type="button" class="s">Aceitar</button></div>';
    document.body.appendChild(box);

    function decidir(valor) {
      try { localStorage.setItem(CHAVE, valor); } catch (e) {}
      if (valor === 'aceito') gtag('consent', 'update', { analytics_storage: 'granted' });
      box.remove();
    }
    box.querySelector('.s').addEventListener('click', function () { decidir('aceito'); });
    box.querySelector('.n').addEventListener('click', function () { decidir('recusado'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarAviso);
  else montarAviso();
})();

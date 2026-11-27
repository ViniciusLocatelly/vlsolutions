/* VLSolutions: contador proprio de visitas e pedidos de contato, lido no CRM (Marketing > Site e anuncios).
   Sem cookie, sem IP gravado e sem identificador da pessoa: conta so a pagina de entrada, a origem da
   visita (busca, Google Ads, redes sociais, direto, outros sites) e o tipo de pedido de contato.
   A origem e a pagina de entrada ficam no sessionStorage da aba e somem quando ela e fechada. */
(function () {
  // Endereco principal: workers.dev. O crm.vlsolutions.com.br e barrado em alguns navegadores (bloqueio do cliente),
  // por isso fica so de reserva, quando o envio principal nem sai.
  var URL_CRM = 'https://vls-crm.vlsolutions.workers.dev/api/publico/site';
  var URL_RESERVA = 'https://crm.vlsolutions.com.br/api/publico/site';
  var CH = 'vls-contador';

  // Aparelho da equipe (marcado em /equipe.html, pelo botao do Sistema-VLS): nao conta. So avisa uma vez por
  // visita, para a lista "Aparelhos da equipe" mostrar a ultima visita e quantas ficaram de fora.
  var eq = null;
  try { eq = JSON.parse(localStorage.getItem('vls-equipe') || 'null'); } catch (e) { eq = null; }
  if (eq && /^[a-f0-9]{24}$/.test(eq.id || '')) {
    var visto = null;
    try { visto = sessionStorage.getItem('vls-equipe-visto'); sessionStorage.setItem('vls-equipe-visto', '1'); } catch (e) { visto = '1'; }
    if (!visto) enviar('equipe', { id: eq.id });
    return;
  }

  function origemDaVisita() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { q = { get: function () { return null; } }; }
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid') || /cpc|ppc|paid/i.test(q.get('utm_medium') || '')) return 'google_ads';
    if (q.get('utm_source')) return 'campanha';
    var ref = document.referrer;
    if (!ref) return 'direto';
    var h = '';
    try { h = new URL(ref).hostname; } catch (e) { return 'outros'; }
    if (/(^|\.)vlsolutions\.com\.br$/.test(h)) return null; // navegacao interna
    if (/(^|\.)(google|bing|yahoo|duckduckgo|ecosia|search\.brave|yandex)\./.test(h)) return 'busca';
    if (/instagram|facebook|fb\.|linkedin|lnkd|(^|\.)t\.co$|twitter|(^|\.)x\.com$|youtube|whatsapp|tiktok|threads/.test(h)) return 'social';
    return 'outros';
  }

  function sessao() {
    try { return JSON.parse(sessionStorage.getItem(CH) || 'null'); } catch (e) { return null; }
  }

  function enviar(evento, s) {
    var corpo = JSON.stringify(s.id ? { e: evento, id: s.id } : { e: evento, p: s.p, o: s.o });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(URL_CRM, new Blob([corpo], { type: 'text/plain' }))) return;
    } catch (e) { /* tenta o fetch */ }
    try {
      fetch(URL_CRM, { method: 'POST', body: corpo, mode: 'no-cors', keepalive: true, headers: { 'content-type': 'text/plain' } })
        .catch(function () { try { navigator.sendBeacon && navigator.sendBeacon(URL_RESERVA, new Blob([corpo], { type: 'text/plain' })); } catch (e) { /* perde o aviso */ } });
    } catch (e) { /* sem rede: perde o aviso */ }
  }

  // Inicio da visita: primeira pagina aberta nesta aba (ou chegada de fora com outra origem).
  var s = sessao();
  var o = origemDaVisita();
  if (!s || (o && o !== 'direto' && o !== s.o)) {
    s = { p: location.pathname || '/', o: o || 'direto' };
    try { sessionStorage.setItem(CH, JSON.stringify(s)); } catch (e) { /* aba privada sem storage: conta mesmo assim */ }
    enviar('visita', s);
  }

  // Pedidos de contato: o contato conta para a pagina de entrada da visita, igual ao relatorio do CRM.
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/wa\.me|api\.whatsapp\.com/.test(href)) enviar('whatsapp', sessao() || s);
    else if (/^mailto:/.test(href)) enviar('email', sessao() || s);
    else if (/^tel:/.test(href)) enviar('telefone', sessao() || s);
  }, true);
  document.addEventListener('submit', function (ev) {
    var f = ev.target;
    if (!f || !f.matches) return;
    if (f.matches('.rx-home, #rxBusca')) enviar('raiox', sessao() || s);
    else enviar('formulario', sessao() || s);
  }, true);
})();

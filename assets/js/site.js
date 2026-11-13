/* ACCROC – comportamento comum a todas as páginas */
(function () {
  var root = document.body.getAttribute('data-root') || './';

  /* Menu no telemóvel */
  var nav = document.querySelector('.mainnav');
  var btn = document.querySelector('.menubtn');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  /* Links ainda sem destino */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function getJSON(path) {
    return fetch(root + path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  /* Separadores (Centro de Dia) */
  var tabs = [].slice.call(document.querySelectorAll('.tabbtn'));
  if (tabs.length) {
    var keys = ['centro', 'docs', 'parc'];
    var ON = null, OFF = null;
    tabs.forEach(function (t) {
      if (t.style.backgroundColor === 'rgb(255, 255, 255)') ON = t.getAttribute('style');
      else OFF = t.getAttribute('style');
    });
    function selectTab(i) {
      tabs.forEach(function (o, j) {
        o.setAttribute('style', j === i ? ON : OFF);
        o.setAttribute('aria-selected', j === i);
      });
      document.querySelectorAll('[data-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-panel') !== keys[i];
      });
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { selectTab(i); }); });
    var h = location.hash.replace('#', '');
    if (h === 'documentacao' || h === 'relatorios') selectTab(1);
    if (h === 'parcerias') selectTab(2);
  }

  /* Próximos eventos (vêm de data/eventos.json, gerado a partir do Facebook) */
  var evBox = document.querySelector('[data-ev="title"]');
  if (evBox) {
    var EV = [], ei = 0;
    var poster = document.querySelector('[data-ev-poster]');
    var posterEmpty = poster ? poster.innerHTML : '';
    var link = document.querySelector('[data-ev-link]');
    function setEv() {
      var e = EV[ei];
      if (!e) return;
      if (poster) {
        poster.innerHTML = e.image
          ? '<img src="' + esc(e.image) + '" alt="Cartaz: ' + esc(e.title) + '" style="width:100%;height:100%;object-fit:cover;border-radius:16px">'
          : posterEmpty;
        poster.style.padding = e.image ? '0' : '';
      }
      document.querySelectorAll('[data-ev="title"]').forEach(function (x) { x.textContent = e.title; });
      document.querySelectorAll('[data-ev="date"]').forEach(function (x) { x.textContent = e.date; });
      document.querySelectorAll('[data-ev="place"]').forEach(function (x) { x.textContent = e.place || ''; });
      document.querySelectorAll('[data-ev="counter"]').forEach(function (x) { x.textContent = (ei + 1) + ' de ' + EV.length; });
      if (link && e.link) link.href = e.link;
    }
    document.querySelectorAll('[data-evbtn]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (!EV.length) return;
        ei = (ei + parseInt(b.getAttribute('data-evbtn'), 10) + EV.length) % EV.length;
        setEv();
      });
    });
    getJSON('data/eventos.json').then(function (d) {
      var today = new Date().toISOString().slice(0, 10);
      EV = (d.eventos || []).filter(function (e) { return !e.iso || e.iso >= today; });
      if (EV.length) { ei = 0; setEv(); }
      else if (!d.exemplo) {
        EV = [{ title: 'Sem eventos marcados', date: 'Em breve novidades', place: 'Siga-nos no Facebook', link: 'https://www.facebook.com/accrouteirodacorticadaipss' }];
        ei = 0; setEv();
        document.querySelectorAll('[data-ev="counter"], [data-evbtn]').forEach(function (x) { x.hidden = true; });
      }
    }).catch(function () { /* fica o exemplo que está na página */ });
  }

  /* Notícias (vêm de data/noticias.json, gerado a partir do Facebook) */
  var news = document.querySelector('[data-noticias]');
  if (news) {
    var fb = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z"></path></svg>';
    getJSON('data/noticias.json').then(function (d) {
      var posts = (d.posts || []).slice(0, 3);
      if (!posts.length || d.exemplo) return;
      news.innerHTML = posts.map(function (p) {
        var img = p.image
          ? '<img src="' + esc(p.image) + '" alt="" style="width:100%;height:200px;object-fit:cover;display:block">'
          : '<div style="height:200px;background:#D6E0EF;display:flex;align-items:center;justify-content:center"><img src="' + root + 'assets/img/brasao.png" alt="" style="height:110px;width:auto;opacity:.8"></div>';
        return '<a href="' + esc(p.link) + '" target="_blank" rel="noopener" style="text-decoration:none;color:#0D1B2E;background:#FFFFFF;border-radius:22px;overflow:hidden;display:flex;flex-direction:column">' +
          img +
          '<div style="padding:24px;display:flex;flex-direction:column;gap:10px;flex-grow:1">' +
          '<span style="font-size:13px;color:#4A5568">' + esc(p.date) + '</span>' +
          '<p style="margin:0;font-family:\'Source Serif 4\',Georgia,serif;font-weight:700;font-size:19px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">' + esc(p.text) + '</p>' +
          '<span style="margin-top:auto;padding-top:8px;display:flex;align-items:center;gap:6px;font-size:15px;font-weight:600;color:#166AEA">' + fb + 'Ver no Facebook →</span>' +
          '</div></a>';
      }).join('');
    }).catch(function () { /* fica o exemplo que está na página */ });
  }

  /* Formulário de contacto: abre o email com a mensagem já escrita */
  var form = document.querySelector('[data-contacto]');
  if (form) {
    var send = form.querySelector('button');
    send.addEventListener('click', function () {
      var v = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var assunto = v('assunto') || 'Contacto';
      var corpo = v('msg') + '\n\n' + v('nome') + '\n' + v('email');
      var para = assunto === 'Centro de Dia' ? 'centrodiaouteiro@sapo.pt' : 'accrouteirocorticada@gmail.com';
      location.href = 'mailto:' + para + '?subject=' + encodeURIComponent('Site: ' + assunto) + '&body=' + encodeURIComponent(corpo);
    });
  }
})();

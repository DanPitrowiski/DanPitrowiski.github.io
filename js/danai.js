/* danai.js: the DanAI chat widget (Figma: Portfolio Exploration › DanAI · Chatbot).
   Answers come from the DanAI Cloudflare Worker in _danai-worker/.
   Until ENDPOINT is set the widget stays hidden. Add ?danai to a page URL to preview it. */
(function () {
  var ENDPOINT = 'https://danai.danpitrowiski.workers.dev';
  var EMAIL = 'danpitrowiski@gmail.com';
  var RESUME = 'Daniel%20Pitrowiski%20-%20Senior%20Product%20Designer.pdf';

  var demo = !ENDPOINT && /[?&]danai\b/.test(location.search);
  if (!ENDPOINT && !demo) return;

  var PROMPTS = [
    'Can you walk me through your design process?',
    'How do you approach product strategy?',
    'How do you design AI people can trust?',
    'Whats your best example of AI product design?',
    'What kind of role are you looking for?',
    'What business impact has your design work had?',
    'What business impact has your design work had?',
    'What makes you different from other senior product designers?',
    'How do you use AI in your own design work?',
    'Tell me about a design that didnt work out.'
  ];
  // "Try another" order after the first question
  var FOLLOW_UPS = [PROMPTS[0], PROMPTS[1], PROMPTS[2], PROMPTS[3]];
  var SOURCES = {
    'index': ['Dan’s portfolio', 'index.html'],
    'resume-wootric': ['CXInsights case study', 'resume-wootric.html'],
    'ai-auto-tagging': ['AI auto-tagging case study', 'ai-auto-tagging.html'],
    'resume-pg-forsta': ['Press Ganey case study', 'resume-pg-forsta.html'],
    'enthuse': ['Enthuse case study', 'enthuse.html'],
    'article-great-designer-portfolio': ['Portfolio article', 'article-great-designer-portfolio.html'],
    'knight': ['Knight of the Living Dead', 'knight.html'],
    'resume': ['Resume', RESUME],
    'email': ['Email Dan', 'mailto:' + EMAIL]
  };

  // Per-tab memory so the chat follows the visitor between pages
  var store = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem('danai:' + k)); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem('danai:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var history = store.get('history') || []; // [{role, content, sources}]
  var savedOpen = store.get('open');
  var START_OPEN = false; // true opens the panel on a visitor's first page view (desktop only)
  var open = savedOpen === null ? START_OPEN && window.matchMedia('(min-width: 900px)').matches : savedOpen;
  var busy = false;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function icon(name, cls) {
    var i = el('span', 'danai-icon danai-icon--' + name + (cls ? ' ' + cls : ''));
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  // ---------- Build ----------
  var root = el('div', 'danai');
  var launcher = el('button', 'danai-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-controls', 'danai-panel');
  launcher.appendChild(el('span', 'danai-avatar danai-avatar--light', 'D'));
  launcher.appendChild(el('span', null, 'Ask DanAI'));

  var panel = el('section', 'danai-panel');
  panel.id = 'danai-panel';
  panel.setAttribute('aria-label', 'DanAI chat');

  var head = el('header', 'danai-head');
  head.appendChild(el('span', 'danai-avatar', 'D'));
  var title = el('div', 'danai-title');
  title.appendChild(el('p', 'danai-name', 'DanAI'));
  title.appendChild(el('p', 'danai-sub', 'From Dan’s portfolio'));
  head.appendChild(title);
  var minimize = el('button', 'danai-min');
  minimize.type = 'button';
  minimize.setAttribute('aria-label', 'Minimize DanAI');
  minimize.appendChild(icon('chevron'));
  head.appendChild(minimize);

  var body = el('div', 'danai-body');
  var log = el('div', 'danai-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  body.appendChild(log);
  var prompts = el('div', 'danai-prompts');
  body.appendChild(prompts);

  var form = el('form', 'danai-composer');
  var field = el('div', 'danai-input');
  var input = el('input');
  input.type = 'text';
  input.placeholder = 'Ask about Dan…';
  input.maxLength = 600;
  input.autocomplete = 'off';
  input.setAttribute('aria-label', 'Ask DanAI a question');
  var send = el('button', 'danai-send');
  send.type = 'submit';
  send.setAttribute('aria-label', 'Send');
  send.appendChild(icon('send'));
  field.appendChild(input);
  field.appendChild(send);
  form.appendChild(field);

  panel.appendChild(head);
  panel.appendChild(body);
  panel.appendChild(form);
  root.appendChild(panel);
  root.appendChild(launcher);
  document.body.appendChild(root);

  // ---------- Render ----------
  function renderGreeting() {
    var g = el('div', 'danai-greeting');
    g.appendChild(el('p', 'danai-hi', 'Hi, I’m DanAI.'));
    g.appendChild(el('p', 'danai-intro', 'Ask me anything about Dan’s work, process or experience.'));
    log.appendChild(g);
  }
  function renderUser(text) {
    var row = el('div', 'danai-user-row');
    row.appendChild(el('p', 'danai-user', text));
    log.appendChild(row);
  }
  // Plain text from DanAI: paragraphs, "- " bullets and "1. " numbered items. Always set as text, never HTML.
  function appendText(parent, text) {
    var list = null;
    String(text).split(/\n+/).forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var bullet = /^[-*\u2022]\s+(.*)$/.exec(line), num = /^\d+[.)]\s+(.*)$/.exec(line);
      var type = bullet ? 'ul' : num ? 'ol' : null;
      if (!type) { list = null; parent.appendChild(el('p', null, line)); return; }
      if (!list || list.tagName.toLowerCase() !== type) { list = el(type, 'danai-list'); parent.appendChild(list); }
      list.appendChild(el('li', null, (bullet || num)[1]));
    });
  }
  function renderAnswer(text, sources, isError) {
    var a = el('div', 'danai-answer' + (isError ? ' danai-answer--error' : ''));
    appendText(a, text);
    if (sources && sources.length) {
      var s = el('div', 'danai-sources');
      sources.forEach(function (id) {
        var src = SOURCES[id];
        if (!src) return;
        var link = el('a', 'danai-source');
        link.href = src[1];
        if (id === 'resume') { link.target = '_blank'; link.rel = 'noopener'; }
        link.appendChild(icon('external'));
        link.appendChild(document.createTextNode(src[0]));
        s.appendChild(link);
      });
      a.appendChild(s);
    }
    log.appendChild(a);
  }
  function renderPrompts() {
    prompts.textContent = '';
    if (busy) return;
    var asked = history.filter(function (m) { return m.role === 'user'; }).map(function (m) { return m.content; });
    var order = asked.length ? FOLLOW_UPS : PROMPTS.slice(0, 3);
    var left = order.filter(function (p) { return asked.indexOf(p) < 0; }).slice(0, asked.length ? 2 : 3);
    if (!left.length) return;
    if (asked.length) prompts.appendChild(el('p', 'danai-try', 'Try another'));
    left.forEach(function (p) {
      var b = el('button', 'danai-prompt');
      b.type = 'button';
      b.appendChild(icon('prompt'));
      b.appendChild(el('span', null, p));
      b.addEventListener('click', function () { ask(p); });
      prompts.appendChild(b);
    });
  }
  function renderAll() {
    log.textContent = '';
    if (!history.length) renderGreeting();
    history.forEach(function (m) {
      if (m.role === 'user') renderUser(m.content);
      else renderAnswer(m.content, m.sources, m.error);
    });
    renderPrompts();
  }
  function scrollDown() { body.scrollTop = body.scrollHeight; }
  // Show the newest question at the top of the panel, with its answer below it
  function scrollToLatest() {
    var rows = log.querySelectorAll('.danai-user-row');
    var last = rows[rows.length - 1];
    if (!last) return scrollDown();
    body.scrollTop = last.offsetTop - body.offsetTop - 16;
  }

  function setOpen(next, focus) {
    open = next;
    store.set('open', open);
    root.classList.toggle('is-open', open);
    panel.hidden = !open;
    launcher.hidden = open;
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { scrollDown(); if (focus) input.focus(); }
    else if (focus) launcher.focus();
  }

  // ---------- Ask ----------
  function ask(q) {
    q = (q || '').trim();
    if (!q || busy) return;
    history.push({ role: 'user', content: q });
    input.value = '';
    busy = true;
    renderAll();
    var typing = el('div', 'danai-typing');
    typing.setAttribute('aria-label', 'DanAI is typing');
    typing.appendChild(el('i')); typing.appendChild(el('i')); typing.appendChild(el('i'));
    log.appendChild(typing);
    scrollDown();

    var done = function (answer, sources, error) {
      busy = false;
      history.push({ role: 'assistant', content: answer, sources: sources || [], error: !!error });
      store.set('history', history.slice(-20));
      renderAll();
      scrollToLatest();
    };

    if (demo) {
      setTimeout(function () {
        done('DanAI isn’t connected yet, so this is a preview. Once it’s live, the answer to your question will show here.', ['email']);
      }, 700);
      return;
    }
    // Leave out failed turns (the question and its error) so roles keep alternating
    var payload = history.filter(function (m, i) {
      return !m.error && !(history[i + 1] && history[i + 1].error);
    }).slice(-10).map(function (m) { return { role: m.role, content: m.content }; });
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payload, page: location.pathname })
    }).then(function (r) {
      return r.json().then(function (d) { return { status: r.status, d: d }; });
    }).then(function (res) {
      if (res.status === 429) return done('That’s a lot of questions at once. Give it a minute, or email Dan at ' + EMAIL + '.', ['email'], true);
      if (res.status !== 200 || !res.d.answer) throw new Error('bad');
      done(res.d.answer, res.d.sources);
    }).catch(function () {
      done('DanAI couldn’t answer just now. You can email Dan at ' + EMAIL + '.', ['email'], true);
    });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  launcher.addEventListener('click', function () { setOpen(true, true); });
  minimize.addEventListener('click', function () { setOpen(false, true); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false, true); });

  renderAll();
  setOpen(open, false);
})();

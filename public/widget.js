(function () {
  "use strict";

  var scriptTag = document.currentScript;
  if (!scriptTag) return;

  var widgetKey = scriptTag.getAttribute("data-widget-key");
  if (!widgetKey) {
    console.error("[Quantum Chat] Missing data-widget-key attribute on the script tag.");
    return;
  }

  var apiOrigin = scriptTag.getAttribute("data-api") || new URL(scriptTag.src).origin;
  var accentColor = scriptTag.getAttribute("data-color") || "#d5b054";
  var label = scriptTag.getAttribute("data-label") || "Chat with us";

  var sessionKey = "qcrm_widget_session_" + widgetKey;
  var sessionId = localStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId =
      window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : "sess-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    localStorage.setItem(sessionKey, sessionId);
  }

  var host = document.createElement("div");
  host.style.all = "initial";
  document.body.appendChild(host);
  var root = host.attachShadow({ mode: "open" });

  var style = document.createElement("style");
  style.textContent =
    "*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}" +
    ".qcrm-btn{position:fixed;bottom:20px;right:20px;width:56px;height:56px;border-radius:999px;" +
    "background:" + accentColor + ";color:#0a0a0a;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25);" +
    "z-index:2147483000;display:flex;align-items:center;justify-content:center;font-size:24px;}" +
    ".qcrm-panel{position:fixed;bottom:88px;right:20px;width:min(340px,calc(100vw - 40px));" +
    "height:min(480px,calc(100vh - 140px));background:#111;color:#f2f2f2;border-radius:12px;" +
    "box-shadow:0 8px 32px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;z-index:2147483000;}" +
    ".qcrm-panel.open{display:flex;}" +
    ".qcrm-header{background:" + accentColor + ";color:#0a0a0a;padding:12px 16px;font-weight:600;font-size:14px;}" +
    ".qcrm-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;}" +
    ".qcrm-msg{max-width:80%;padding:8px 12px;border-radius:10px;font-size:13px;line-height:1.4;word-wrap:break-word;}" +
    ".qcrm-msg.inbound{align-self:flex-end;background:" + accentColor + ";color:#0a0a0a;}" +
    ".qcrm-msg.outbound{align-self:flex-start;background:#262626;color:#f2f2f2;}" +
    ".qcrm-form{display:flex;border-top:1px solid #262626;padding:8px;gap:8px;}" +
    ".qcrm-input{flex:1;border:1px solid #333;background:#1a1a1a;color:#f2f2f2;border-radius:8px;padding:8px 10px;font-size:13px;}" +
    ".qcrm-send{background:" + accentColor + ";color:#0a0a0a;border:none;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;font-weight:600;}" +
    ".qcrm-empty{color:#888;font-size:13px;text-align:center;margin-top:20px;}";
  root.appendChild(style);

  var button = document.createElement("button");
  button.className = "qcrm-btn";
  button.setAttribute("aria-label", label);
  button.textContent = "💬";
  root.appendChild(button);

  var panel = document.createElement("div");
  panel.className = "qcrm-panel";
  panel.innerHTML =
    '<div class="qcrm-header">' + label + '</div>' +
    '<div class="qcrm-messages"><div class="qcrm-empty">Send a message and we\'ll reply here.</div></div>' +
    '<form class="qcrm-form">' +
    '<input class="qcrm-input" type="text" placeholder="Type a message…" maxlength="4000" />' +
    '<button class="qcrm-send" type="submit">Send</button>' +
    "</form>";
  root.appendChild(panel);

  var messagesEl = panel.querySelector(".qcrm-messages");
  var formEl = panel.querySelector(".qcrm-form");
  var inputEl = panel.querySelector(".qcrm-input");

  var isOpen = false;
  var pollTimer = null;
  var renderedIds = {};

  function renderMessages(messages) {
    if (!messages.length) return;
    var wasScrolledToBottom =
      messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 40;

    var emptyState = messagesEl.querySelector(".qcrm-empty");
    if (emptyState) emptyState.remove();

    messages.forEach(function (m) {
      if (renderedIds[m.id]) return;
      renderedIds[m.id] = true;
      var el = document.createElement("div");
      el.className = "qcrm-msg " + (m.direction === "inbound" ? "inbound" : "outbound");
      el.textContent = m.body;
      messagesEl.appendChild(el);
    });

    if (wasScrolledToBottom) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function fetchMessages() {
    var url =
      apiOrigin +
      "/api/widget/messages?widgetKey=" +
      encodeURIComponent(widgetKey) +
      "&sessionId=" +
      encodeURIComponent(sessionId);

    fetch(url)
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && data.messages) renderMessages(data.messages);
      })
      .catch(function () {});
  }

  function startPolling() {
    if (pollTimer) return;
    fetchMessages();
    pollTimer = setInterval(fetchMessages, 4000);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  button.addEventListener("click", function () {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    if (isOpen) {
      startPolling();
      inputEl.focus();
    } else {
      stopPolling();
    }
  });

  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";

    var optimistic = { id: "local-" + Date.now(), direction: "inbound", body: text };
    renderMessages([optimistic]);

    fetch(apiOrigin + "/api/widget/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetKey: widgetKey, sessionId: sessionId, body: text }),
    })
      .then(function () {
        fetchMessages();
      })
      .catch(function () {});
  });
})();

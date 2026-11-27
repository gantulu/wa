function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

export function renderChat(root, conversation, { onBack, onAction }) {
  const avatar = `<span class="avatar" style="background:${conversation.color}">${conversation.initials}</span>`;
  root.innerHTML = `
    <header class="chat-header">
      <div class="chat-contact">
        <button class="icon-button back-button" type="button" data-action="back" aria-label="Kembali ke daftar chat">‹</button>
        ${avatar}
        <div class="chat-contact-copy"><div class="chat-contact-name">${conversation.name}</div><div class="chat-contact-status">${conversation.online ? "online" : "terakhir dilihat baru-baru ini"}</div></div>
      </div>
      <div class="chat-actions">
        <button class="icon-button optional-action" type="button" data-action="video" aria-label="Panggilan video" title="Panggilan video">▣</button>
        <button class="icon-button" type="button" data-action="search" aria-label="Cari pesan" title="Cari">⌕</button>
        <button class="icon-button" type="button" data-action="more" aria-label="Opsi lainnya" title="Opsi lainnya">⋮</button>
      </div>
    </header>
    <div class="message-list" id="message-list" role="log" aria-live="polite" aria-label="Pesan percakapan">
      <div class="message-day">HARI INI</div>
      ${conversation.messages.map((message) => messageMarkup(message)).join("")}
    </div>
    <form class="message-composer" id="message-form">
      <div class="composer-actions">
        <button class="icon-button" type="button" data-action="emoji" aria-label="Emoji" title="Emoji">☺</button>
        <button class="icon-button optional-action" type="button" data-action="attach" aria-label="Lampirkan file" title="Lampirkan">＋</button>
      </div>
      <input class="message-input" id="message-input" type="text" maxlength="4000" placeholder="Ketik pesan" autocomplete="off" aria-label="Tulis pesan" />
      <button class="send-button" type="submit" aria-label="Kirim pesan" title="Kirim">➤</button>
    </form>`;
  const messageList = root.querySelector("#message-list");
  const input = root.querySelector("#message-input");
  const scrollBottom = () => { messageList.scrollTop = messageList.scrollHeight; };
  scrollBottom();
  root.querySelector("#message-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const message = { from: "out", text, time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date()) };
    conversation.messages.push(message);
    conversation.preview = text;
    conversation.time = message.time;
    messageList.insertAdjacentHTML("beforeend", messageMarkup(message));
    input.value = "";
    scrollBottom();
  });
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    if (button.dataset.action === "back") onBack();
    else onAction(button.dataset.action);
  });
}

function messageMarkup(message) {
  return `<div class="message-item ${message.from === "out" ? "outgoing" : "incoming"}">${escapeHtml(message.text)}<div class="message-meta"><span>${message.time}</span>${message.from === "out" ? "<span aria-label='Terkirim'>✓✓</span>" : ""}</div></div>`;
}

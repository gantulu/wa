const initialConversations = [
  { id: "1", name: "Nadia Putri", initials: "NP", color: "#8b6f9f", time: "10.42", preview: "Oke, nanti aku kabari ya.", unread: 2, online: true, messages: [{ from: "in", text: "Hai! Gimana kabarnya?", time: "10.30" }, { from: "out", text: "Baik, kamu gimana?", time: "10.34" }, { from: "in", text: "Oke, nanti aku kabari ya.", time: "10.42" }] },
  { id: "2", name: "Tim Produk", initials: "TP", color: "#527b91", time: "09.18", preview: "Rizky: desain terbaru sudah siap", unread: 4, group: true, messages: [{ from: "in", text: "Pagi semua, update desain terbaru sudah siap.", time: "09.12" }, { from: "out", text: "Terima kasih, saya review dulu.", time: "09.18" }] },
  { id: "3", name: "Budi Santoso", initials: "BS", color: "#9b795b", time: "Kemarin", preview: "Foto", unread: 0, messages: [{ from: "in", text: "Jangan lupa file yang kemarin.", time: "16.20" }] },
  { id: "4", name: "Keluarga", initials: "K", color: "#658b70", time: "Kemarin", preview: "Ibu: Hati-hati di jalan", unread: 0, group: true, messages: [{ from: "in", text: "Hati-hati di jalan semuanya.", time: "18.05" }] },
  { id: "5", name: "Dimas", initials: "D", color: "#8c7771", time: "Senin", preview: "Siap, terima kasih!", unread: 0, messages: [{ from: "out", text: "Bisa kita jadwalkan minggu depan?", time: "13.05" }, { from: "in", text: "Siap, terima kasih!", time: "13.10" }] },
  { id: "6", name: "Sarah Wijaya", initials: "SW", color: "#8a8d59", time: "Minggu", preview: "Sampai ketemu!", unread: 0, messages: [{ from: "in", text: "Sampai ketemu!", time: "20.11" }] }
];

export const conversations = initialConversations;

export function renderSidebar(root, { onSelect, onAction }) {
  root.innerHTML = `
    <div class="sidebar-header">
      <div class="brand"><span class="brand-mark" aria-hidden="true">◉</span><span>WhatsApp</span></div>
      <div class="sidebar-actions">
        <button class="icon-button" type="button" data-action="new-chat" aria-label="Chat baru" title="Chat baru">＋</button>
        <button class="icon-button" type="button" data-action="menu" aria-label="Menu" title="Menu">⋮</button>
      </div>
    </div>
    <div class="sidebar-search">
      <label class="search-wrap"><span aria-hidden="true">⌕</span><input id="conversation-search" type="search" placeholder="Cari atau mulai chat baru" autocomplete="off" /></label>
    </div>
    <nav class="sidebar-filters" aria-label="Filter percakapan">
      <button class="filter-chip" type="button" data-filter="all" aria-pressed="true">Semua</button>
      <button class="filter-chip" type="button" data-filter="unread" aria-pressed="false">Belum dibaca</button>
      <button class="filter-chip" type="button" data-filter="favorites" aria-pressed="false">Favorit</button>
      <button class="filter-chip" type="button" data-filter="groups" aria-pressed="false">Grup</button>
    </nav>
    <div class="conversation-list" id="conversation-list" role="list"></div>`;
  let activeFilter = "all";
  let query = "";
  const list = root.querySelector("#conversation-list");
  const draw = () => {
    const items = conversations.filter((item) => {
      const matchesFilter = activeFilter === "all" || (activeFilter === "unread" && item.unread) || (activeFilter === "groups" && item.group) || (activeFilter === "favorites" && item.favorite);
      return matchesFilter && item.name.toLowerCase().includes(query);
    });
    list.innerHTML = items.length ? items.map((item) => `
      <button class="conversation-item" type="button" role="listitem" data-conversation-id="${item.id}" aria-current="false">
        <span class="avatar" style="background:${item.color}">${item.initials}</span>
        <span class="conversation-copy">
          <span class="conversation-top"><span class="conversation-name">${item.name}</span><span class="conversation-time">${item.time}</span></span>
          <span class="conversation-bottom"><span class="conversation-preview">${item.preview}</span>${item.unread ? `<span class="unread-count">${item.unread}</span>` : ""}</span>
        </span>
      </button>`).join("") : '<div class="empty-list">Tidak ada percakapan yang cocok.</div>';
  };
  draw();
  root.querySelector("#conversation-search").addEventListener("input", (event) => { query = event.target.value.trim().toLowerCase(); draw(); });
  root.querySelector(".sidebar-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    root.querySelectorAll("[data-filter]").forEach((chip) => chip.setAttribute("aria-pressed", String(chip === button)));
    draw();
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-conversation-id]");
    if (!button) return;
    const conversation = conversations.find((item) => item.id === button.dataset.conversationId);
    if (conversation) { conversation.unread = 0; draw(); onSelect(conversation); }
  });
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) onAction(button.dataset.action);
  });
}

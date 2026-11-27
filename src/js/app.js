import { conversations, renderSidebar } from "./components/sidebar.js";
import { renderChat } from "./components/chat.js";
import { showDialog } from "./components/overlay.js";

const sidebarRoot = document.querySelector("#sidebar-root");
const chatView = document.querySelector("#chat-view");
const emptyState = document.querySelector("#chat-empty-state");
const appLayout = document.querySelector(".app-layout");
const dialog = document.querySelector("#dialog-container");
let activeConversation = null;

function showAction(action) {
  const messages = {
    "new-chat": ["Chat baru", "Pilih kontak untuk memulai percakapan. Integrasi kontak belum diaktifkan."],
    menu: ["Menu", "Pengaturan dan fitur lanjutan akan tersedia pada iterasi berikutnya."],
    video: ["Panggilan video", "Panggilan belum terhubung pada versi frontend ini."],
    search: ["Cari pesan", "Pencarian pesan akan tersedia pada iterasi berikutnya."],
    more: ["Opsi percakapan", "Fitur percakapan lanjutan belum diaktifkan."],
    emoji: ["Emoji", "Pemilih emoji akan ditambahkan pada iterasi berikutnya."],
    attach: ["Lampirkan file", "Upload media belum diaktifkan pada versi frontend ini."]
  };
  const [title, message] = messages[action] || ["Informasi", "Aksi ini belum tersedia."];
  showDialog(dialog, title, message);
}

function selectConversation(conversation) {
  activeConversation = conversation;
  emptyState.hidden = true;
  chatView.hidden = false;
  appLayout.classList.add("is-chat-open");
  renderChat(chatView, conversation, {
    onBack: () => {
      appLayout.classList.remove("is-chat-open");
      chatView.hidden = true;
      emptyState.hidden = false;
      activeConversation = null;
    },
    onAction: showAction
  });
}
renderSidebar(sidebarRoot, { onSelect: selectConversation, onAction: showAction });

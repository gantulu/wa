export function showDialog(root, title, message) {
  root.innerHTML = `<div class="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h2 id="dialog-title">${title}</h2><p>${message}</p><div class="dialog-footer"><button class="dialog-close" type="button">Tutup</button></div></div>`;
  root.classList.add("is-open");
  root.querySelector("button").addEventListener("click", close);
  root.addEventListener("click", (event) => { if (event.target === root) close(); }, { once: true });
  function close() { root.classList.remove("is-open"); root.innerHTML = ""; }
}

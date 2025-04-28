import "./components/DataTable.js";

(() => {
  const codeBlocks = document.querySelectorAll('pre[class*="language-"]');

  codeBlocks.forEach((pre) => {
    pre.classList.add('relative-code-block');

    const button = document.createElement('button');
    button.classList.add('copy-button');
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
    `;

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    });

    pre.appendChild(button);
  });
})();


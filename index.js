const printBtn = document.getElementById('print');
const codeTextArea = document.getElementsByTagName('textarea')[0];
const code = document.getElementById('code');
const documentNameInput = document.getElementById('document-name-input');
const documentTitle = document.getElementById('document-title');
const languageSelector = document.getElementById('languages');
const codeLines = document.getElementById('line-nums');
const themeStylesheet = document.getElementById('theme-style');
const themeSelector = document.getElementById('themes');
let selectedLanguage = localStorage.getItem('language') || 'javascript';
let selectedTheme = localStorage.getItem('theme') || 'github-dark';
let codeText = localStorage.getItem('code') || 'console.log("Hello World")';

// Set up the initial state
document.addEventListener('securitypolicyviolation', function (event) {
    if (event.violatedDirective === 'expect-ct') {
        event.preventDefault();
    }
});

themeStylesheet.setAttribute('href', getStylesheet(selectedTheme));
themeSelector.value = selectedTheme;
code.classList.add('hljs', `language-${selectedLanguage}`);
code.innerHTML = escape(codeText);
codeTextArea.value = codeText;
languageSelector.value = selectedLanguage;
documentTitle.innerHTML = documentNameInput.value || 'Untitled';
updateLineNumbers();
hljs.configure({
    languages: ['java', 'javascript', 'html', 'typescript', 'cpp']
});
hljs.highlightElement(code);

// Attach event listeners
documentNameInput.addEventListener('input', () => {
    documentTitle.innerHTML = documentNameInput.value || 'Untitled';
});

printBtn.addEventListener('click', () => {
    console.log('Print button clicked.');
    document.title = documentTitle.textContent || 'code.pdf';
    window.print();
    document.title = 'Code Formatter';
});

codeTextArea.addEventListener('input', () => {
    codeText = codeTextArea.value;
    localStorage.setItem('code', codeText);
    code.innerHTML = escape(codeText);
    updateLineNumbers();
    hljs.highlightElement(code);
});

languageSelector.addEventListener('change', () => {
    code.classList.remove(`language-${selectedLanguage}`);
    selectedLanguage = languageSelector.value;
    localStorage.setItem('language', selectedLanguage);
    code.classList.add(`language-${selectedLanguage}`);
    hljs.highlightElement(code);
});

themeSelector.addEventListener('change', () => {
    selectedTheme = themeSelector.value;
    themeStylesheet.href = getStylesheet(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    hljs.highlightElement(code);
    documentTitle.innerHTML = documentNameInput.value || 'Untitled';
});

window.addEventListener('beforeprint', event => {
    document.body.classList.add('hljs');
});

window.addEventListener('afterprint', event => {
    document.body.classList.remove('hljs');
});

// Helper functions
function escape(s) {
    return s.replace(/[^0-9A-Za-z ]/g, c => `&#${c.charCodeAt(0)};`);
}

function updateLineNumbers() {
    const lines = codeTextArea.value.split('\n');
    const numLines = lines.length;
    const numLinesDigits = numLines.toString().length;
    let html = '';
    for (let i = 0; i < numLines; i++) {
        html += `<pre>${(i + 1).toString().padStart(numLinesDigits)} </pre>`;
        for (let j = 0; j < lines[i].length / 98 - 1; j++) {
            html += `<pre>${''.padStart(numLinesDigits)} </pre>`;
        }
    }
    codeLines.innerHTML = html;
}

function getStylesheet(style) {
    return `//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/${style}.min.css`;
}

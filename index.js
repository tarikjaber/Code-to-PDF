let printBtn = document.getElementById('print');
let codeTextArea = document.getElementsByTagName('textarea')[0];
let code = document.getElementById('code');
let documentNameInput = document.getElementById('document-name-input');
let documentTitle = document.getElementById('document-title');
let languageSelector = document.getElementById('languages');
let codeLines = document.getElementById('line-nums');
let themeStylesheet = document.getElementById('theme-style');
let themeSelector = document.getElementById('themes');
let selectedLanguage = 'javascript';
let selectedTheme = 'default';
let codeText = 'console.log("Hello World")';
selectedTheme = localStorage.getItem('theme') ?? 'github-dark';
themeStylesheet.setAttribute('href', getStylesheet(selectedTheme));
themeSelector.value = selectedTheme;
code.classList.remove(`language-${selectedLanguage}`);
selectedLanguage = localStorage.getItem('language') ?? 'javascript';
code.classList.add(`language-${selectedLanguage}`);
languageSelector.value = selectedLanguage;
themeStylesheet.setAttribute('href', getStylesheet(selectedTheme));
codeText = localStorage.getItem('code') ?? 'console.log("Hello World")';
localStorage.setItem('code', codeText);
codeTextArea.value = codeText;
code.innerHTML = escape(codeText);
updateLineNumbers();
hljs.configure({
    languages: ['java', 'javascript', 'html', 'typescript', 'cpp']
});
hljs.highlightElement(code);
code.classList.add(`language-${selectedLanguage}`);
code.classList.add('hljs');
documentNameInput.addEventListener('input', () => {
    documentTitle.innerHTML = documentNameInput.value;
});
printBtn.addEventListener('click', () => {
    console.log("Print button clicked.");
    document.title = documentTitle.textContent ?? "code.pdf";
    window.print();
    document.title = "Code Formatter";
});
function escape(s) {
    return s.replace(/[^0-9A-Za-z ]/g, c => "&#" + c.charCodeAt(0) + ";");
}
codeTextArea.addEventListener('input', () => {
    if (codeTextArea.value !== '') {
        localStorage.setItem('code', codeTextArea.value);
        code.innerHTML = escape(codeTextArea.value);
        updateLineNumbers();
    }
    else {
        code.innerHTML = "";
        localStorage.setItem('code', '');
        updateLineNumbers();
    }
    hljs.highlightElement(code);
});
function updateLineNumbers() {
    let lines = codeTextArea.value.split('\n');
    if (lines[lines.length - 1] === '') {
        code.style.paddingBottom = "31px";
    }
    else {
        code.style.paddingBottom = "14px";
    }
    let numLines = lines.length;
    let numLinesDigits = numLines.toString().length;
    codeLines.innerHTML = "";
    for (let i = 0; i < numLines; i++) {
        codeLines.innerHTML += `<pre>${(i + 1).toString().padStart(numLinesDigits)} </pre>`;
        for (let j = 0; j < (lines[i].length) / 98 - 1; j++) {
            codeLines.innerHTML += `<pre>${"".padStart(numLinesDigits)} </pre>`;
        }
    }
    codeLines.classList.add("hljs");
}
languageSelector.addEventListener('change', () => {
    code.classList.remove(`language-${selectedLanguage}`);
    selectedLanguage = languageSelector.value.replace("<", "&lt;").replace(">", "&gt;");
    code.classList.add(`language-${selectedLanguage}`);
    localStorage.setItem('language', selectedLanguage);
    hljs.highlightElement(code);
});
themeSelector.addEventListener('change', () => {
    themeStylesheet.href = getStylesheet(themeSelector.value);
    documentTitle.innerHTML = documentNameInput.value;
    localStorage.setItem('theme', themeSelector.value);
    hljs.highlightElement(code);
});
function getStylesheet(style) {
    return `//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/${style}.min.css`;
}
window.addEventListener('beforeprint', event => {
    document.body.classList.add('hljs');
});
window.addEventListener('afterprint', event => {
    document.body.classList.remove('hljs');
});

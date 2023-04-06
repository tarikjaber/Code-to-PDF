const printBtn = document.getElementById('print');
const codeTextArea = document.getElementsByTagName('textarea')[0];
const code = document.getElementById('code');
const documentNameInput = document.getElementById('document-name-input');
const languageSelector = document.getElementById('languages');
const codeLines = document.getElementById('line-nums');
const themeStylesheet = document.getElementById('theme-style');
const themeSelector = document.getElementById('themes');
const codeContainer = document.getElementById('code-container');
let selectedLanguage = localStorage.getItem('language') || 'javascript';
let selectedTheme = localStorage.getItem('theme') || 'github-dark';
let codeText = localStorage.getItem('code') || 'console.log("Hello World")';

// Set up the initial state
themeStylesheet.setAttribute('href', getStylesheet(selectedTheme));
themeSelector.value = selectedTheme;
code.classList.add('hljs', `language-${selectedLanguage}`);
escaped = escapeHtml(codeText);
code.innerHTML = escaped;
codeTextArea.value = codeText;
languageSelector.value = selectedLanguage;
hljs.configure({
    languages: ['java', 'javascript', 'html', 'typescript', 'cpp']
});

updateCode();

// Attach event listeners
printBtn.addEventListener('click', () => {
    updateCode();
    let optGroup = themeSelector.options[themeSelector.selectedIndex].parentNode;
    const lineNumbers = document.querySelectorAll('.line-number');
    const root = document.documentElement;

    if (optGroup.label === 'Dark') {
        root.style.setProperty('--border-thickness', '0px');
        for (let i = 0; i < lineNumbers.length; i++) {
            lineNumbers[i].style.backgroundColor = '#353b48';
            lineNumbers[i].style.color = '#dfe6e9';
        }
    } else {
        root.style.setProperty('--border-thickness', '1px');
        for (let i = 0; i < lineNumbers.length; i++) {
            lineNumbers[i].style.backgroundColor = '#dcdde1';
            lineNumbers[i].style.color = '#2d3436';
        }
    }
    document.title = documentNameInput.value || 'Code';
    window.print();
    document.title = 'Convert Code to PDF Online: Free Tool for Programming Languages';
});

codeTextArea.addEventListener('input', () => {
    codeText = codeTextArea.value;
    localStorage.setItem('code', codeText);
    code.innerHTML = escapeHtml(codeText);
});

languageSelector.addEventListener('change', () => {
    code.classList.remove(`language-${selectedLanguage}`);
    selectedLanguage = languageSelector.value;
    localStorage.setItem('language', selectedLanguage);
    code.classList.add(`language-${selectedLanguage}`);
});

themeSelector.addEventListener('change', () => {
    selectedTheme = themeSelector.value;
    themeStylesheet.href = getStylesheet(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
});

// Helper functions
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getStylesheet(style) {
    return `//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/${style}.min.css`;
}

function createCodeLine(lineNumber, lineContent) {
    lineContent = lineContent || ' ';
    const code = `<code id="code" class="hljs language-${selectedLanguage}">${lineContent}</code>`;
    return `<div class="code-line"><span class="line-number">${lineNumber}</span><pre class="code-pre">${code}</pre></div>`;
}

function updateCode() {
    const lines = codeTextArea.value.split('\n');
    const numLines = lines.length;
    let formattedCode = '';

    for (let i = 0; i < lines.length; i++) {
        const lineNumber = (i + 1).toString().padStart(Math.floor(Math.log10(numLines)) + 1, ' ');
        const lineContent = escapeHtml(lines[i]);
        const codeLine = createCodeLine(lineNumber, lineContent);
        formattedCode += codeLine;
    }

    codeContainer.innerHTML = formattedCode;
    hljs.highlightAll();
}





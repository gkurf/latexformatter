// Configuration objects
const TOOLBAR_SECTIONS = [
    {
        name: 'Symbols',
        buttons: [
            { symbol: '\\pi', display: '\\pi' },
            { symbol: '\\phi', display: '\\phi' },
            { symbol: '\\Omega', display: '\\Omega' },
            { symbol: '\\Theta', display: '\\Theta' },
            { symbol: '\\mathcal{O}', display: '\\mathcal{O}' },
            { symbol: '\\mathcal{F}', display: '\\mathcal{F}' }
        ]
    },
    {
        name: 'Logic',
        buttons: [
            { symbol: '\\in', display: '\\in' },
            { symbol: '\\subset', display: '\\subset' },
            { symbol: '\\exists', display: '\\exists' },
            { symbol: '\\forall', display: '\\forall' },
            { symbol: '\\implies', display: '\\implies' },
            { symbol: '\\equiv', display: '\\equiv' },
        ]
    },
    {
        name: 'Operators',
        buttons: [
            { symbol: '\\leftarrow', display: '\\leftarrow' },
            { symbol: '\\times', display: '\\times' },
            { symbol: '\\cdot', display: '\\cdot' },
            { symbol: '\\frac{}{}', display: '\\frac{x}{y}' },
            { symbol: '\\mid', display: 'x \\mid y' }
        ]
    },
    {
        name: 'Functions',
        buttons: [
            { symbol: '\\sum_{i=0}^{n}', display: '\\sum_{i=0}^{n}' },
            { symbol: '\\sin()', display: '\\sin()' },
            { symbol: '\\cos()', display: '\\cos()' },
            { symbol: '\\log()', display: '\\log()' },
            { symbol: '\\log_{n}()', display: '\\log_{n}()' },
            { symbol: '\\pmod{}', display: 'x \\pmod{y}' },
        ]
    },
    {
        name: 'Sets',
        buttons: [
            { symbol: '\\mathbb{N}', display: '\\mathbb{N}' },
            { symbol: '\\mathbb{Z}', display: '\\mathbb{Z}' },
            { symbol: '\\mathbb{Z}^+', display: '\\mathbb{Z}^+' },
            { symbol: '\\mathbb{R}', display: '\\mathbb{R}' },
            { symbol: '\\mathbb{Q}', display: '\\mathbb{Q}' },
        ]
    },
    {
        name: 'Brackets',
        buttons: [
            { symbol: '\\{\\}', display: '\\{x\\}' },
            { symbol: '\\vert{}\\vert', display: '\\vert{x}\\vert' },
            { symbol: '\\lfloor{}\\rfloor', display: '\\lfloor{x}\\rfloor' },
            { symbol: '\\lceil{}\\rceil', display: '\\lceil{x}\\rceil' },
        ]
    },
    {
        name: 'Text Format',
        buttons: [
            { symbol: '\\text{}', display: '\\text{Text}' },
            { symbol: '\\textbf{}', display: '\\textbf{Bold}' },
            { symbol: '\\underline{}', display: '\\underline{Underline}' },
        ]
    }
];

const CURSOR_PLACEMENT_RULES = [
    { open: '\\vert{', close: '}\\vert' },
    { open: '\\lfloor{', close: '}\\rfloor' },
    { open: '\\lceil{', close: '}\\rceil' },
    { open: '{', close: '}{}' },
    { open: '{', close: '}' },
    { open: '(', close: ')' },
    { open: '\\{', close: '\\}' }
];

const ALGORITHM_SUBSTITUTIONS = [
    { pattern: /algorithm (\w+)\(/g, replacement: '\\textbf{algorithm } \\text{$1}(' },
    { pattern: /Algorithm (\w+)\(/g, replacement: '\\textbf{Algorithm } \\text{$1}(' },
    { pattern: /end algorithm/g, replacement: '\\textbf{end algorithm}' },
    { pattern: /end Algorithm/g, replacement: '\\textbf{end Algorithm}' },
    { pattern: /if /g, replacement: '\\textbf{if }' },
    { pattern: / then/g, replacement: '\\textbf{ then}' },
    { pattern: /end if/g, replacement: '\\textbf{end if}' },
    { pattern: /for /g, replacement: '\\textbf{for }' },
    { pattern: /end for/g, replacement: '\\textbf{end for}' },
    { pattern: / from /g, replacement: '\\text{ from }' },
    { pattern: / to /g, replacement: '\\text{ to }' },
    { pattern: / by dividing by /g, replacement: '\\text{ by dividing by }' },
    { pattern: / by multiplying by /g, replacement: '\\text{ by multiplying by }' },
    { pattern: / by /g, replacement: '\\text{ by }' },
    { pattern: /while /g, replacement: '\\textbf{while }' },
    { pattern: / do/g, replacement: '\\textbf{ do}' },
    { pattern: /end while/g, replacement: '\\textbf{end while}' },
    { pattern: /let /g, replacement: '\\text{let }' },
    { pattern: / be the size of /g, replacement: '\\text{ be the size of }' },
    { pattern: /array/g, replacement: '\\text{array}' },
    { pattern: /item/g, replacement: '\\text{item}' },
    { pattern: /return /g, replacement: '\\textbf{return }' },
];

const OTHER_SUBSTITUTIONS = [
    { pattern: /True/g, replacement: '\\text{True}' },
    { pattern: /False/g, replacement: '\\text{False}' },
    { pattern: /\t/g, replacement: '\\quad ' },
    { pattern: /<=/g, replacement: '\\leq' },
    { pattern: />=/g, replacement: '\\geq' },
    { pattern: /!=/g, replacement: '\\neq' }
];

const INDENT_TRIGGERS = [
    " do",
    "algorithm ",
    "Algorithm ",
    " then"
];

// DOM elements
const preview = document.getElementById('preview');
const output = document.getElementById('output');
const rawInput = document.getElementById('raw-input');
const lineNumbersCheckbox = document.getElementById('line-numbers');
const algorithmAutoTextCheckbox = document.getElementById('algorithm-auto-format');
const toolbar = document.getElementById('toolbar');
const example = document.getElementById('latex-render');
const delimiterRadios = document.getElementsByName('delimiter');
let isEditing = false;

// Initialize toolbar
function initializeToolbar() {
    TOOLBAR_SECTIONS.forEach(section => {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = section.name;
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        section.buttons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'tool-button';
            buttonElement.onclick = () => insertSymbol(button.symbol);
            buttonElement.textContent = button.display;
            
            // Add data attribute for tooltip
            buttonElement.setAttribute('data-latex', button.symbol);
            
            buttonGroup.appendChild(buttonElement);
        });

        fieldset.appendChild(legend);
        fieldset.appendChild(buttonGroup);
        toolbar.appendChild(fieldset);
    });
}

// Update the renderButtons function to preserve the data-latex attribute
function renderButtons() {
    const buttons = document.querySelectorAll('.tool-button');
    buttons.forEach(button => {
        const latexContent = button.textContent.trim();
        if (latexContent) {
            try {
                // Store the original content temporarily
                const originalLatex = button.getAttribute('data-latex');
                
                // Render the KaTeX content
                button.innerHTML = katex.renderToString(latexContent, {
                    displayMode: false,
                    throwOnError: false,
                    fontSize: '1em'
                });
                
                // Restore the data-latex attribute
                button.setAttribute('data-latex', originalLatex);
            } catch (e) {
                console.error('KaTeX rendering error on button:', e);
            }
        }
    });
}

// Text processing functions
function getIndentation(line) {
    const match = line.match(/^(\t*)/);
    return match ? match[1] : '';
}

function shouldAddIndent(line) {
    return INDENT_TRIGGERS.some(trigger => line.trim().includes(trigger));
}

function calculateNewIndentation(currentLine) {
    let indentation = getIndentation(currentLine);
    if (shouldAddIndent(currentLine) && algorithmAutoTextCheckbox.checked) {
        indentation += '\t';
    }
    return indentation;
}

// Modify the formatText function
function formatText(content) {
    let formattedContent = content;

    // Apply algorithm substitutions only if enabled
    if (algorithmAutoTextCheckbox.checked) {
        ALGORITHM_SUBSTITUTIONS.forEach(({ pattern, replacement }) => {
            formattedContent = formattedContent.replace(pattern, replacement);
        });
    }

    // Always apply other substitutions
    OTHER_SUBSTITUTIONS.forEach(({ pattern, replacement }) => {
        formattedContent = formattedContent.replace(pattern, replacement);
    });

    const lines = formattedContent.split('\n');
    const selectedDelimiter = Array.from(delimiterRadios).find(radio => radio.checked).value;

    return lines.map((line, index) => {
        const lineNumber = lineNumbersCheckbox.checked ? `\\text{${index + 1}.}\\ ` : '';
        
        switch (selectedDelimiter) {
            case 'gradescope':
                return `$$${lineNumber}${line}$$`;
            case 'single':
                return `$${lineNumber}${line}$`;
            case 'none':
                return `${lineNumber}${line}`;
            default:
                return `$$${lineNumber}${line}$$`;
        }
    }).join('\n');
}

// Modify the renderKaTeX function
function renderKaTeX(text, box) {
    try {
        const lines = text.split('\n');
        const selectedDelimiter = Array.from(delimiterRadios).find(radio => radio.checked).value;
        
        const processedLines = lines.map(line => {
            let math = line;
            if (selectedDelimiter === 'gradescope' && line.startsWith('$$') && line.endsWith('$$')) {
                math = line.slice(2, -2);
            } else if (selectedDelimiter === 'single' && line.startsWith('$') && line.endsWith('$')) {
                math = line.slice(1, -1);
            }
            
            try {
                return `<div>${katex.renderToString(math, {
                    displayMode: false, // Always use inline mode for consistent styling
                    throwOnError: false,
                    fontSize: '1em',
                })}</div>`;
            } catch (e) {
                return `<div>${line}</div>`;
            }
        });
        box.innerHTML = processedLines.join('');
    } catch (e) {
        box.textContent = text;
        console.error('KaTeX rendering error:', e);
    }
}

function updateOutput() {
    const processedText = formatText(rawInput.value)
    output.value = processedText;
    renderKaTeX(processedText, preview);
}

function switchToEdit() {
    isEditing = true;
    preview.classList.add('hidden');
    output.classList.remove('hidden');
    output.focus();
}

function switchToPreview() {
    isEditing = false;
    preview.classList.remove('hidden');
    output.classList.add('hidden');
    renderKaTeX(output.value, preview);
}

function insertSymbol(symbol) {
    const start = rawInput.selectionStart;
    const end = rawInput.selectionEnd;
    const text = rawInput.value;
    let newPosition;

    const cursorRule = CURSOR_PLACEMENT_RULES.find(rule => 
        symbol.includes(rule.open + rule.close)
    );

    // Use document.execCommand to allow undo/redo
    rawInput.focus();
    document.execCommand('insertText', false, '');

    if (cursorRule) {
        if (start === end) {
            document.execCommand('insertText', false, symbol);
            newPosition = start + symbol.indexOf(cursorRule.open) + cursorRule.open.length;
        } else {
            const selectedText = text.substring(start, end);
            const modifiedSymbol = symbol.replace(cursorRule.open + cursorRule.close, `${cursorRule.open}${selectedText}${cursorRule.close}`);
            document.execCommand('insertText', false, modifiedSymbol);
            newPosition = start + selectedText.length + symbol.length;
        }
    } else {
        document.execCommand('insertText', false, symbol);
        newPosition = start + symbol.length;
    }

    rawInput.selectionStart = rawInput.selectionEnd = newPosition;
    updateOutput();
}

function copyToClipboard() {
    const textToCopy = output.value;
    const copyButton = document.querySelector('.copy-button');

    navigator.clipboard.writeText(textToCopy).then(() => {
        copyButton.classList.add('flash');
        setTimeout(() => {
            copyButton.classList.remove('flash');
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        output.select();
        document.execCommand('copy');
    });
}

// Event Listeners
rawInput.addEventListener('input', updateOutput);
rawInput.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const start = rawInput.selectionStart;
        const end = rawInput.selectionEnd;
        rawInput.value = rawInput.value.substring(0, start) + '\t' +
            rawInput.value.substring(end);
        rawInput.selectionStart = rawInput.selectionEnd = start + 1;
        updateOutput();
    } else if (event.key === 'Enter') {
        event.preventDefault();
        const start = rawInput.selectionStart;
        const text = rawInput.value;
        const beforeCursor = text.substring(0, start);
        const afterCursor = text.substring(start);
        const lines = beforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];
        const indentation = calculateNewIndentation(currentLine);

        rawInput.value = beforeCursor + '\n' + indentation + afterCursor;
        const newPosition = start + 1 + indentation.length;
        rawInput.selectionStart = rawInput.selectionEnd = newPosition;
        updateOutput();
    }
});

preview.addEventListener('click', switchToEdit);
output.addEventListener('blur', switchToPreview);
output.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        output.blur();
    }
});

lineNumbersCheckbox.addEventListener('change', updateOutput);
algorithmAutoTextCheckbox.addEventListener('change', updateOutput);

document.addEventListener('DOMContentLoaded', () => {
    katex.render("\\textbf{algorithm}, \\textbf{end algorithm}, \\textbf{if}, \\textbf{then}, \\textbf{end if}, \\textbf{for}, \\textbf{end for}, \\textbf{while}, \\textbf{do}, \\textbf{end while}, \\textbf{return}", document.getElementById("bold-example"), { throwOnError: false });
});

document.addEventListener('DOMContentLoaded', () => {
    katex.render("\\text{let}, \\text{be the size of}, \\text{array}, \\text{from}, \\text{to}, \\text{by}", document.getElementById("text-example"), { throwOnError: false });
});

document.addEventListener('DOMContentLoaded', () => {
    katex.render("\\text{True}, \\text{False}", document.getElementById("logic-example"), { throwOnError: false });
});

document.addEventListener('DOMContentLoaded', () => {
    renderKaTeX(formatText(`algorithm BubbleSort(A:array)
	let n be the size of A
	repeat \\leftarrow True
	while repeat do
		repeat \\leftarrow False
		for i from 0 to n-2 do
			if A[i] > A[i+1] then
				\\text{Swap}(A, i, i+1)
				repeat \\leftarrow True
			end if
		end for
	end while
	return A
end algorithm`), example)
  });

  delimiterRadios.forEach(radio => {
    radio.addEventListener('change', updateOutput);
});

// Initialize the page
window.onload = function () {
    // Initialize toolbar, buttons, and output updates
    initializeToolbar();
    renderButtons();
    updateOutput();
};
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
function formatText(content, options = {}) {
    let formattedContent = content;
    
    // Get current state of UI controls if not provided in options
    const algorithmFormat = options.algorithmFormat ?? algorithmAutoTextCheckbox.checked;
    const lineNumbers = options.lineNumbers ?? lineNumbersCheckbox.checked;
    const delimiter = options.delimiter ?? Array.from(delimiterRadios).find(radio => radio.checked)?.value ?? 'gradescope';

    // Apply algorithm substitutions only if enabled
    if (algorithmFormat) {
        ALGORITHM_SUBSTITUTIONS.forEach(({ pattern, replacement }) => {
            formattedContent = formattedContent.replace(pattern, replacement);
        });
    }

    // Always apply other substitutions
    OTHER_SUBSTITUTIONS.forEach(({ pattern, replacement }) => {
        formattedContent = formattedContent.replace(pattern, replacement);
    });

    const lines = formattedContent.split('\n');
    
    return lines.map((line, index) => {
        const lineNumber = lineNumbers ? `\\text{${index + 1}.}\\ ` : '';
        
        switch (delimiter) {
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

  delimiterRadios.forEach(radio => {
    radio.addEventListener('change', updateOutput);
});

// Initialize the page
window.onload = function () {
    // Initialize toolbar, buttons, and output updates
    initializeToolbar();
    initializeExamples();
    renderButtons();
    updateOutput();
};
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
            { symbol: '\\exists', display: '\\exists' },
            { symbol: '\\forall', display: '\\forall' },
            { symbol: '\\implies', display: '\\implies' },
            { symbol: '\\equiv', display: '\\equiv' },
            { symbol: '\\therefore', display: '\\therefore' },
            { symbol: '\\square', display: '\\square' },
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
    { pattern: /else if /g, replacement: '\\textbf{else if }' },
    { pattern: /if /g, replacement: '\\textbf{if }' },
    { pattern: /	else/g, replacement: '	\\textbf{else}' },
    { pattern: / then/g, replacement: '\\textbf{ then}' },
    { pattern: /end if/g, replacement: '\\textbf{end if}' },
    { pattern: /for each /g, replacement: '\\textbf{for each }' },
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
    { pattern: /null/g, replacement: '\\text{null}' },
    { pattern: /\t/g, replacement: '\\quad ' },
    { pattern: /<=/g, replacement: '\\leq' },
    { pattern: />=/g, replacement: '\\geq' },
    { pattern: /!=/g, replacement: '\\neq' }
];

const INDENT_TRIGGERS = [
    " do",
    "algorithm ",
    "Algorithm ",
    " then",
    "else"
];
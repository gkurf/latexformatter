// Configuration object for all examples
const KATEX_EXAMPLES = {
    bigO: {
        id: "bigO-examples",
        title: "Big-O Notation Examples",
        plainText: 
`f(n) \\in \\mathcal{O}(g(n)) \\text{ if } \\exists c > 0, \\exists n_0 > 0, \\text{ s.t. } 0 <= f(n) <= c \\cdot g(n)	\\forall n > n_0
f(n) \\in \\Omega(g(n)) \\text{ if } \\exists c > 0, \\exists n_0 > 0, \\text{ s.t. } 0 <= c \\cdot g(n) <= f(n)	\\forall n > n_0
f(n) \\in \\Theta(g(n)) \\text{ if } \\exists c_1 > 0, \\exists c_2 > 0, \\exists n_0 > 0, \\text{ s.t. } 0 <= c_1 \\cdot g(n) <= f(n) <= c_2 \\cdot g(n)	\\forall n > n_0`,
        renderOptions: { lineNumbers: false, algorithmFormat: false, delimiter: 'none' }
    },
    bubbleSort: {
        id: "bubblesort-example",
        title: "BubbleSort Example",
        plainText:
`algorithm BubbleSort(A:array)
	let n be the size of A
	repeat \\leftarrow True
	while repeat do
		repeat \\leftarrow False
		for i from 0 to n-2 do
			if A[i] > A[i+1] then
				Swap(A, i, i+1)
				repeat \\leftarrow True
			end if
		end for
	end while
	return A
end algorithm`,
        renderOptions: { lineNumbers: true, algorithmFormat: true, delimiter: 'none' }
    },
    keywords: {
        id: "keywords-example",
        title: "Keywords",
        sections: [
            {
                text: "Bold Keywords: ",
                content: ["algorithm,", "end algorithm,", "if,", "then,", "end if,", "for,", "end for,", "while,", "do,", "end while,", "return"],
                format: (word) => `\\textbf{${word}}`
            },
            {
                text: "Text Keywords: ",
                content: ["let,", "be the size of,", "array,", "from,", "to,", "by"],
                format: (word) => `\\text{${word}}`
            }
        ]
    },
    substitutions: {
        id: "substitutions-example",
        title: "Common Substitutions",
        sections: [
            { text: "<=,>= to ", content: ["\\leq, \\geq"] },
            { text: "!= to ", content: ["\\neq"] },
            { text: "True, False to ", content: ["\\text{True}, \\text{False}"] },
            { text: "null to ", content: ["\\text{null}"] }
        ]
    }
};

function createListExample(config, container) {
    const section = document.createElement('div');
    section.className = 'list-section';

    const list = document.createElement('ul');
    config.sections.forEach(item => {
        const listItem = document.createElement('li');
        listItem.appendChild(document.createTextNode(item.text));
        
        item.content.forEach((content, index) => {
            const katexSpan = document.createElement('span');
            katexSpan.className = 'katex-keyword';
            const formula = item.format ? item.format(content) : content;
            katex.render(formula, katexSpan, { throwOnError: false, displayMode: false });
            listItem.appendChild(katexSpan);
            
            if (index < item.content.length - 1) {
                listItem.appendChild(document.createTextNode(' '));
            }
        });
        list.appendChild(listItem);
    });

    section.appendChild(list);
    container.appendChild(section);
}

function createCodeExample(config, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'algorithm-container';

    const plainTextBox = document.createElement('div');
    plainTextBox.className = 'algorithm-box';
    plainTextBox.innerHTML = `
        <div class="algorithm-title">Plain Text Input</div>
        <pre><code>${config.plainText}</code></pre>
    `;

    const formattedBox = document.createElement('div');
    formattedBox.className = 'algorithm-box';
    formattedBox.innerHTML = `<div class="algorithm-title">Formatted Output</div>`;

    const formattedContent = document.createElement('div');
    formattedContent.id = config.id;
    formattedContent.className = 'latex';
    formattedBox.appendChild(formattedContent);

    wrapper.appendChild(plainTextBox);
    wrapper.appendChild(formattedBox);
    container.appendChild(wrapper);

    const formattedText = formatText(config.plainText, config.renderOptions);
    renderKaTeX(formattedText, formattedContent);
}

function initializeExamples() {
    const containers = {
        bigO: 'bigO-examples',
        keywords: 'keywords-examples',
        substitutions: 'substitutions-examples',
        bubbleSort: 'algorithm-examples'
    };

    Object.entries(containers).forEach(([key, containerId]) => {
        const container = document.getElementById(containerId);
        if (container) {
            const config = KATEX_EXAMPLES[key];
            if (key === 'keywords' || key === 'substitutions') {
                createListExample(config, container);
            } else {
                createCodeExample(config, container);
            }
        }
    });
}

window.initializeExamples = initializeExamples;

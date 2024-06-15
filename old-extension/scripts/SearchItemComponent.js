(() => {
    class SearchItemComponent extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({ mode: 'open' });

            const wrapper = document.createElement('div');
            wrapper.setAttribute('class', 'wrapper');

            const text = document.createElement('span');
            text.textContent = 'Hello, I am a Web Component!';

            wrapper.appendChild(text);

            const style = document.createElement('style');
            style.textContent = `
                .wrapper {
                    background-color: lightgray;
                    padding: 10px;
                    border: 1px solid #ccc;
                }
            `;

            shadow.appendChild(style);
            shadow.appendChild(wrapper);
        }
    }

    customElements.define('search-item-component', SearchItemComponent);
})();
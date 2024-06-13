if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
    afterDOMLoaded();
}

function afterDOMLoaded() {
    const containers = document.getElementsByClassName('right-content-box')
    if (!containers.length) {
        console.warn('No containers found')
        return;
    }

    const container = containers[0];
    const button = document.createElement('button');
    button.innerText = 'Click me';
    button.onclick = function () {
        alert('Button clicked');
    }
    container.appendChild(button);
}
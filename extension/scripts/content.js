if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
    afterDOMLoaded().catch(console.error);
}

async function afterDOMLoaded() {
    const containers = document.getElementsByClassName('right-content-box')
    if (!containers.length) {
        console.warn('No containers found')
        return;
    }

    const mainContainer = containers[0];
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q')


    const resp = await fetch('http://localhost:8080/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query
        })
    })
    const { data } = await resp.json();
    console.log(data);

    for (const item of data) {
        const div = document.createElement('div');
        div.className = 'kagi-result-item';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'kagi-title-container';

        const dot = document.createElement('span');
        dot.className = 'kagi-title-dot';
        titleContainer.appendChild(dot);

        const title = document.createElement('a');
        title.className = 'kagi-result-title';
        title.href = item.url;
        title.innerText = item.title;
        titleContainer.appendChild(title);

        div.appendChild(titleContainer);

        const url = document.createElement('span');
        url.className = 'kagi-result-url';
        url.innerText = item.url;
        div.appendChild(url);

        const date = document.createElement('span');
        date.className = 'kagi-result-date';
        date.innerText = new Date().toLocaleDateString();

        const description = document.createElement('p');
        description.className = 'kagi-result-description';
        description.innerText = item.description;
        description.prepend(date)

        div.appendChild(description);
        mainContainer.appendChild(div);
    }

    addStyles();
}

function addStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .kagi-result-item {
            margin-bottom: 15px;
        }
        .kagi-title-container {
            display: flex;
            align-items: center;
        }
        .kagi-title-dot {
            width: 8px;
            height: 8px;
            background-color: #5f6dfc;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
        .kagi-result-title {
            font-size: 18px;
            color: #fff;
            border-bottom: 1px solid #acacaf;
            
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .kagi-result-title:hover {
            border-bottom: 1px solid #6c5edc;
            color: #6c5edc;
        }
        .kagi-result-url {
            color: #acacaf;
            font-size: 14px;
        }
        .kagi-result-date {
            color: #acacaf;
            background-color: var(--search-result-date-bg);
            border-radius: 5px;
            padding: 2px 5px;
            margin-right: 5px;
        }
        .kagi-result-description {
            font-size: 14px;
            color: #4d5156;
            margin-top: 5px;
            
            flex: 1;
            word-break: break-word;
        }
    `;
    document.head.appendChild(style);
}

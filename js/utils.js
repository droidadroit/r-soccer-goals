export let 
    orify = (field, list) => list.map(el => `${field}:${el}`).join(' OR '),

    andify = (field, list) => list.map(el => `${field}:${el}`).join(' AND '),

    getDate = (timestamp) => {
        let d = new Date(timestamp);
        return `${d.getDate()} ${d.toLocaleString('en-us', {month: 'short'})} ${d.getFullYear()}`;
    },

    openInNewTab = (link) => {
        chrome.tabs.create({
            url: link,
            active: false
        });
    };

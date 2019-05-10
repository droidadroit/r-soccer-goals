import {flairs, domains} from './constants.js';

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
    },

    getCommentsUrlFromPermalink = (permalink) => `https://reddit.com${permalink}`,

    getQueryForRedditApi = (searchQuery, sortBy) => {
        searchQuery = searchQuery.trim()
        let url = 'https://api.reddit.com/r/soccer/search?q=';
        url += `(${orify('flair', flairs)} OR ${orify('url', domains)})`;
        url += searchQuery === "" ? "" : ` AND (${andify('title', searchQuery.split(/\s+/))})`;
        url += `&restrict_sr=1`
        url += `&sort=${sortBy}`
        url += `&limit=1000`;
        return encodeURI(url);
    },

    processBodyHtml = (html) => html.replace(/&lt;/g, "<").replace(/&gt;/g, ">"),

    assignMirrors = (mirrors, posts, id) => {
        let obj = posts.filter(post => post.id === id);
        obj[0]['mirrors'] = mirrors;
    };

import {flairs, domains, regexes} from './constants.js';
import * as utils from './utils.js';

let getCommentsLink = (link) => `https://reddit.com${link}`

let processData = (rawData) => {
    let filtered_posts = rawData.data.children.filter(child => regexes.some(regex => regex.test(child.data.title)));
    return filtered_posts.map(child => {
        return {
            title: child.data.title,
            comments: getCommentsLink(child.data.permalink), 
            link: child.data.url,
            time: utils.getDate(child.data.created * 1000),
            domain: child.data.domain
        };
    });
};

let getQueryForRedditApi = (searchQuery, sortBy) => {
    searchQuery = searchQuery.trim()
    let url = 'https://api.reddit.com/r/soccer/search?q=';
    url += `(${utils.orify('flair', flairs)} OR ${utils.orify('url', domains)})`;
    url += searchQuery === "" ? "" : ` AND (${utils.andify('title', searchQuery.split(/\s+/))})`;
    url += `&restrict_sr=1`
    url += `&sort=${sortBy}`
    url += `&limit=1000`;
    return encodeURI(url);
};

const app = new Vue({
    el: '#app',

    data: {
        sortBy: 'relevance',
        filter: '',
        posts: '',
        searching: false,
        footer: [
            {
                link: 'https://github.com/droidadroit/r-soccer-goals',
                text: 'Github'
            },
            {
                link: 'https://chrome.google.com/webstore/detail/rsoccer-goals/oledoejmoabfeenmmacihejabhmbhdan',
                text: 'r/soccer goals'
            },
            {
                link: 'mailto:yashwanth.reddyth@gmail.com?subject=%5Br/soccer%20goals%5D',
                text: 'Help'
            }
        ]
    },

    methods: {
        processForm: function() {
            let vm = this;
            vm.posts = [];
            vm.searching = true;
            axios
                .get(getQueryForRedditApi(this.filter, this.sortBy))
                .then(response => {
                    vm.posts = processData(response.data);
                    vm.searching = false;
                })
                .catch(error => console.log(error));
        },

        openLink: utils.openInNewTab
    }
});

import {flairs, domains, regexes} from './constants.js';
import * as utils from './utils.js';

let getCommentsLink = (link) => `https://reddit.com${link}`

let _getMirrors = () => {
    return ['mirror1', 'mirror2', 'mirror3', 'mirror4', 'mirror5', 'mirror6'];
}

let processData = (rawData) => {
    let filtered_posts = rawData.data.children.filter(child => regexes.some(regex => regex.test(child.data.title)));
    return filtered_posts.map(child => {
        return {
                title: child.data.title,
                comments: getCommentsLink(child.data.permalink), 
                link: child.data.url,
                time: utils.getDate(child.data.created * 1000),
                domain: child.data.domain,
                id: child.data.id,
                mirrors: null
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

let processBodyHtml = (html) => {
    return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

let getMirrors = (post_id) => {
    return axios
        .get(encodeURI(`https://api.reddit.com/r/soccer/comments/${post_id}?depth=1&limit=1&sort=top`))
        .then(response => {
            let parent_id = response.data[1].data.children[0].data.id;
            return axios
                .get(encodeURI(`https://api.reddit.com/r/soccer/comments/${post_id}?depth=2&sort=top&comment=${parent_id}`))
                .then(response => {
                    let replies = response.data[1].data.children[0].data.replies.data.children; // FIXME: handle when there are no replies to a comment
                    let body_htmls = replies.map(reply => reply.data.body_html);
                    let mirrors = [];
                    let htmls = body_htmls.map(body_html => processBodyHtml(body_html));
                    mirrors = [];
                    htmls.forEach(html => {
                        html.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, function() {
                            mirrors.push(arguments[2]);
                        });
                    });
                    return mirrors;
                });
            });
};

let assignMirrors = (mirrors, posts, id) => {
    let obj = posts.filter(post => post.id === id);
    obj[0]['mirrors'] = mirrors;
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
        openLink: utils.openInNewTab,
        loadMirrors:function(id) {
            let vm = this;
            if (vm.posts.filter(post => post.id === id)[0].mirrors === null) {
                getMirrors(id).then(data => {
                    assignMirrors(data, vm.posts, id);
                });
            }
        }
    }
});

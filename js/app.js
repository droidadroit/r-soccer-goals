let getCommentsLink = (link) => `https://reddit.com${link}`

let getDate = (timestamp) => {
    let d = new Date(timestamp * 1000);
    return `${d.getDate()} ${d.toLocaleString('en-us', {month: 'short'})} ${d.getFullYear()}`;
};

let processData = (rawData) => {
    regexes = [/[\[,\(][0-9]+[\],\)]\s?[-,:]\s?[0-9]+/, /[0-9]+\s?[-,:]\s?[\[,\(][0-9]+[\],\)]/, /[0-9]+\s?[-,:]\s?[0-9]+/];
    children = rawData.data.children.filter(child => regexes.some(regex => regex.test(child.data.title)));
    return children.map(child => {
        return {
            title: child.data.title,
            comments: getCommentsLink(child.data.permalink), 
            link: child.data.url,
            time: getDate(child.data.created),
            domain: child.data.domain
        };
    });
};

let getFlairs = _ => ['media', 'mirror'];
let getUrl = _ => ['streamable', 'streamja', 'clippituser', 'mixtape'];

let orify = (field, list) => list.map(el => `${field}:${el}`).join(' OR ')
let andify = (field, list) => list.map(el => `${field}:${el}`).join(' AND ')

let getQueryForRedditApi = (searchQuery, sortBy) => {
    searchQuery = searchQuery.trim()
    url = 'https://api.reddit.com/r/soccer/search?q=';
    url += `(${orify('flair', getFlairs())} OR ${orify('url', getUrl())})`;
    url += searchQuery === "" ? "" : ` AND (${andify('title', searchQuery.split(/\s+/))})`;
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

        openLink: function(link) {
            chrome.tabs.create({
                url: link,
                active: false
            });
        }
    }
});




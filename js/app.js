let constructQuery = (filter) =>
    filter.trim().split(/\s+/).map(string => `title:${string}`).join(' AND ');

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

let getQueryForRedditApi = (filter, sortBy) => {
    url = 'https://api.reddit.com/r/soccer/search?q=';
    flairs = '(flair:media OR flair:Mirror)';
    titles = filter.replace(/\s/g, '').length === 0 ? '' : `AND (${constructQuery(filter)})`;
    return encodeURI(`${url}${flairs}${titles}&restrict_sr=1&sort=${sortBy}&limit=1000`);
};

const app = new Vue({
    el: '#app',

    data: {
        sortBy: 'relevance',
        filter: '',
        posts: ''
    },

    methods: {
        processForm: function() {
            let vm = this;
            this.posts = []
            axios
                .get(getQueryForRedditApi(this.filter, this.sortBy))
                .then(response => {vm.posts = processData(response.data);})
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




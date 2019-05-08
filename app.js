import * as utils from './util/utils.js';
import * as postsApi from './api/posts.js'
import * as mirrorsApi from './api/mirrors.js'

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
            postsApi.getPosts(vm.filter, vm.sortby)
                .then(data => {
                    vm.posts = data;
                })
                .finally(_ => {
                    vm.searching = false;
                });
        },

        openLink: utils.openInNewTab,

        loadMirrors: function(id) {
            let vm = this;
            if (vm.posts.filter(post => post.id === id)[0].mirrors === null) {
                mirrorsApi.getMirrors(id).then(data => {
                    utils.assignMirrors(data, vm.posts, id);
                });
            }
        }
    }
});
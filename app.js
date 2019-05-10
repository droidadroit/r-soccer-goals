import * as utils from './util/functions.js'
import * as constants from './util/constants.js'
import * as postsApi from './api/posts.js'
import * as mirrorsApi from './api/mirrors.js'

const app = new Vue({
    el: '#app',

    data: {
        sortBy: constants.defaultOptionsValues.sortBy,
        filter: '',
        posts: '',
        searching: false,
        footer: [
            {
                link: 'https://github.com/droidadroit/r-soccer-goals',
                text: 'Github'
            },
            {
                link: 'mailto:yashwanth.reddyth@gmail.com?subject=%5Br/soccer%20goals%5D',
                text: 'Help'
            }
        ]
    },

    mounted: function() {
        utils.getOptionsValue('sortBy').then(data => this.sortBy = data);
    },

    methods: {
        processForm: function() {
            let vm = this;
            vm.posts = [];
            vm.searching = true;
            postsApi.getPosts(vm.filter, vm.sortBy)
                .then(data => {
                    vm.posts = data;
                })
                .finally(_ => {
                    vm.searching = false;
                });
        },

        loadMirrors: function(id) {
            let vm = this;
            if (vm.posts.filter(post => post.id === id)[0].mirrors === null) {
                mirrorsApi.getMirrors(id).then(data => {
                    utils.assignMirrors(data, vm.posts, id);
                });
            }
        },

        openLink: utils.openInNewTab,

        openSettings: utils.openSettings
    }
});
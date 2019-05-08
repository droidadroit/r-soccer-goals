import * as utils from '../util/utils.js';
import * as constants from '../util/constants.js'

const options = new Vue({
    el: '#options',

    data: {
        sortBy: constants.defaultOptionsValues.sortBy,
        saved: false
    },

    mounted: function() {
        utils.getOptionsValue('sortBy').then(data => this.sortBy = data);
    },

    methods: {
        saveOptions: function() {
            this.save = false;
            chrome.storage.sync.set({
                sortBy: this.sortBy
            }, _ => {
                this.saved = true;
            });
        }
    }
});
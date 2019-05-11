import * as utils from '../util/functions.js';
import * as constants from '../util/constants.js'

const options = new Vue({
    el: '#options',

    data: {
        sortBy: constants.defaultOptionsValues.sortBy,
        saved: false
    },

    mounted: function() {
        utils.getOptionValue('sortBy').then(data => this.sortBy = data);
    },

    methods: {
        saveOptions: function() {
            this.saved = false;
            utils.setOptionValue({
                sortBy: this.sortBy
            }).then(_ => {
                this.saved = true;
            });
        }
    }
});
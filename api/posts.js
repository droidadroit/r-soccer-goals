import * as utils from './../util/utils.js'
import {regexes} from './../util/constants.js'

export let
    getPosts = (filter, sortBy) => {
        return axios
            .get(utils.getQueryForRedditApi(filter, sortBy))
            .then(response => processData(response.data));
    };

let processData = (rawData) => {
    let filtered_posts = rawData.data.children.filter(child => regexes.some(regex => regex.test(child.data.title)));
    return filtered_posts.map(child => {
        return {
            title: child.data.title,
            comments: utils.getCommentsUrlFromPermalink(child.data.permalink), 
            link: child.data.url,
            time: utils.getDate(child.data.created * 1000),
            domain: child.data.domain
        };
    });
};
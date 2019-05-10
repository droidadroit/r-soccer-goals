import * as utils from './../util/utils.js'
import * as constants from './../util/constants.js'

export let
    getMirrors = (postId) => {
        return axios
            .get(encodeURI(`https://api.reddit.com/r/soccer/comments/${postId}?depth=1&limit=1&sort=top`))
            .then(response => {
                let topComment = response.data[1].data.children[0].data;
                let parentCommentId = topComment.id,
                    parentCommentAuthor = topComment.author;
                
                return (
                    (parentCommentAuthor === constants.mirrorsAuthor) ? fetchMirrorsOfAutoModerator(postId, parentCommentId) : fetchMirrorsWithNoAutoModerator(postId)
                ).then(data => data);
            });
    };

let fetchMirrorsFromComments = (comments) => {
    let mirrors = [];
    let body_htmls = comments.map(reply => reply.data.body_html);
    let htmls = body_htmls.map(body_html => utils.processBodyHtml(body_html));
    htmls.forEach(html => {
        html.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, function() {
            mirrors.push(arguments[2]);
        });
    });
    return mirrors;
};

let fetchMirrorsOfAutoModerator = (postId, parentCommentId) => {
    return axios
        .get(encodeURI(`https://api.reddit.com/r/soccer/comments/${postId}?depth=2&sort=top&comment=${parentCommentId}`))
        .then(response => {
            let mirrors = [];
            try {
                let replies = response.data[1].data.children[0].data.replies.data.children;
                mirrors = fetchMirrorsFromComments(replies);
            } catch (err) {
                console.log(err);
            } finally {
                return mirrors;
            }
        });
};

let fetchMirrorsWithNoAutoModerator = (postId) => {
    return axios
        .get(encodeURI(`https://api.reddit.com/r/soccer/comments/${postId}?depth=1&sort=top&limit=${constants.maxNumOfCommentsForMirrors}`))
        .then(response => {
            let mirrors = [];
            try {
                let replies = response.data[1].data.children;
                replies.pop()
                let repliesWithMirrors = replies.filter(reply =>
                    constants.keywordsForMirrorComments.some(keyword => reply.data.body.includes(keyword)));
                mirrors = fetchMirrorsFromComments(repliesWithMirrors);
            } catch (err) {
                console.log(err);
            } finally {
                return mirrors;
            }
        });
};

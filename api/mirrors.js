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
                
                if (parentCommentAuthor === constants.mirrorsAuthor) {
                    return fetchMirrorsOfAutoModerator(postId, parentCommentId).then(data => data);
                } else {
                    // get top K parent comments
                    // check for the presence of links
                }

            });
    };

let fetchMirrorsOfAutoModerator = (postId, parentCommentId) => {
    return axios
        .get(encodeURI(`https://api.reddit.com/r/soccer/comments/${postId}?depth=2&sort=top&comment=${parentCommentId}`))
        .then(response => {
            let mirrors = [];
            try {
                let replies = response.data[1].data.children[0].data.replies.data.children; // FIXME: handle when there are no replies to a comment
                let body_htmls = replies.map(reply => reply.data.body_html);
                let htmls = body_htmls.map(body_html => utils.processBodyHtml(body_html));
                htmls.forEach(html => {
                    html.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, function() {
                        mirrors.push(arguments[2]);
                    });
                });
            } catch (err) {
                console.log(err);
            } finally {
                return mirrors;
            }
        });
};

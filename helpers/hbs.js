// Handlebars helper functions

const moment = require('moment');

module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            let newStr = str + ' ';
            let truncStr;
            truncStr = newStr.substr(0, len);
            newStr = str.substr(0, truncStr.lastIndexOf(' '));
            if (newStr.length <= 0) newStr = truncStr;
            return newStr + '...';
        }
    return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, "")
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() === loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue lighten-3 tooltipped" data-position="right" data-tooltip="Edit story"><i class="fas fa-edit fa-small"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyId}" class="tooltipped" data-position="bottom" data-tooltip="Edit story"><i class="far fa-edit"></i></a>`;
            };
        } else {
            return '';
        };
    },
    select: function(status) {
        if (status === 'public') {
            return `<option value="public" selected>Public</option>
            <option value="unpublished">Unpublished</option>`
        } else if (status === 'unpublished') {
            return `<option value="public">Public</option>
            <option value="unpublished" selected>Unpublished</option>`
        }
    }
}
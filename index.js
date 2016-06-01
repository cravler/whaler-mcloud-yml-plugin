'use strict';

var fs = require('fs');
var path = require('path');

module.exports = exports;

/**
 * @param whaler
 */
function exports(whaler) {

    whaler.before('config', function* (options) {
        const storage = whaler.get('apps');
        const app = yield storage.get.$call(storage, options['name']);

        let configFile = null;
        if (options['file']) {
            configFile = options['file'];
        }

        if (options['update'] && !configFile) {
            configFile = app.config['file'] || null;
        }

        if (configFile && 'mcloud.yml' === path.basename(configFile)) {
            let content = yield fs.readFile.$call(null, configFile, 'utf8');
            options['yml'] = 'services:\n    ' + content.split('\n').join('\n    ');
        }
    });

}

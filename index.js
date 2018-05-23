'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');

const fsReadFile = util.promisify(fs.readFile);

module.exports = exports;

/**
 * @param whaler
 */
async function exports (whaler) {

    whaler.before('config', async ctx => {
        let configFile = null;

        if (ctx.options['file']) {
            configFile = ctx.options['file'];
        }

        if (ctx.options['update'] && !configFile) {
            const { default: storage } = await whaler.fetch('apps');
            const app = await storage.get(ctx.options['name']);
            configFile = app.config['file'] || null;
        }

        if (configFile && 'mcloud.yml' === path.basename(configFile)) {
            let content = await fsReadFile(configFile, 'utf8');
            const yml = 'services:\n    ' + content.split('\n').join('\n    ');
            ctx.options['yml'] = yml;
        }
    });

}

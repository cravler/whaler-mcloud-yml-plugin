'use strict';

const fs = require('fs/promises');
const path = require('path');

module.exports = exports;

/**
 * @param whaler
 */
async function exports (whaler) {

    let tmpFile = null;

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
            tmpFile = configFile + '.tmp';
            let content = await fs.readFile(configFile, 'utf8');
            const yml = 'services:\n    ' + content.split('\n').join('\n    ');
            await fs.writeFile(tmpFile, yml, 'utf8');
        }
    });

    whaler.after('config', async ctx => {
        if (tmpFile) {
            await fs.unlink(tmpFile);
            tmpFile = null;
        }
    });

}

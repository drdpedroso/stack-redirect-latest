'use strict';
// import {getSELinkByPlatform, getProdLinkByPlatform} from '../utils'
const platformFuntions = require('./utils')
const http = require('http');
const fs = require('fs');
const urlSeMac = 'http://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/latest-mac.yml'
const urlSeWindows = 'http://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/latest.yml'
const urlProdMac = 'http://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/latest-mac.yml'
const urlProdWindows = 'http://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/latest-mac.yml'

const download = function(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) {
        fs.unlink(dest);
        if (cb) cb(err.message);
    });
};

module.exports.getSEUrl = (event, context, callback) => {
    const platform = event.pathParameters ? event.pathParameters.platform : 'mac';
    const url = platform === 'mac' ? urlSeMac : urlSeWindows;
    download(url, '/tmp/versions-se.yml', () => {
        const yaml = require('js-yaml');
        try {
            const config = yaml.safeLoad(fs.readFileSync('/tmp/versions-se.yml', 'utf8'));
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    url: platformFuntions.getSELinkByPlatform(platform, config.version)
                }),
            };
            callback(null, response);

        } catch (e) {
            console.log(e)
            callback(null, {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    message: 'Something went wrong :('
                }),
            });
        }
    })
};

module.exports.getProdUrl = (event, context, callback) => {
    const platform = event.pathParameters ? event.pathParameters.platform : 'mac'
    const url = platform === 'mac' ? urlProdMac : urlProdWindows;
    download(url, '/tmp/versions-prod.yml', () => {
        const yaml = require('js-yaml');
        try {
            const config = yaml.safeLoad(fs.readFileSync('/tmp/versions-prod.yml', 'utf8'));
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    url: platformFuntions.getProdLinkByPlatform(platform, config.version)
                }),
            };
            callback(null, response);

        } catch (e) {
            callback(null, {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    message: 'Something went wrogn :('
                }),
            });
        }
    })
};

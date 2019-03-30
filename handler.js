'use strict';

const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const urlSe = 'http://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/latest-mac.yml'
const urlProd = 'http://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/latest-mac.yml'

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
    download(urlSe, '/tmp/versions-se.yml', () => {
        const yaml = require('js-yaml');
        try {
            const config = yaml.safeLoad(fs.readFileSync('/tmp/versions-se.yml', 'utf8'));
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    url: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/Stack+SE-${config.version}.dmg`
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

module.exports.getProdUrl = (event, context, callback) => {
    download(urlProd, '/tmp/versions-prod.yml', () => {
        const yaml = require('js-yaml');
        try {
            const config = yaml.safeLoad(fs.readFileSync('/tmp/versions-prod.yml', 'utf8'));
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    url: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/Stack+SE-${config.version}.dmg`
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

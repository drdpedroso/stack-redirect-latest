'use strict';

const fetch = require('node-fetch');

module.exports.getSEUrl = (event, context, callback) => {
    fetch('http://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/latest-mac.json')
        .then(res => res.json())
        .then(json => {
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    url: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/Stack+SE-${json.version}.dmg`
                }),
            };
            callback(null, response);
        });

};

module.exports.getProdUrl = (event, context, callback) => {
    fetch('http://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/latest-mac.json')
        .then(res => res.json())
        .then(json => {
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: JSON.stringify({
                    url: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/Stack+SE-${json.version}.dmg`
                }),
            };
            callback(null, response);
        });

};

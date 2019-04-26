
const getSELinkByPlatform = (platform = 'mac', version) => {
    const platformLinkMap = {
        mac: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/Stack+SE-${version}.dmg`,
        win: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/se/Stack+SE+Setup+${version}.exe`
    }

    return platformLinkMap[platform]
}

const getProdLinkByPlatform = (platform = 'mac', version) => {
    const platformLinkMap = {
        mac: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/Stack-${version}.dmg`,
        win: `https://s3.eu-central-1.amazonaws.com/stack-v1/builds/prod/Stack+Setup+${version}.exe`
    }

    return platformLinkMap[platform]
}

module.exports = { getProdLinkByPlatform, getSELinkByPlatform };

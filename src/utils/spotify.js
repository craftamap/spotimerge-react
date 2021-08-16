/**
* @param str {string}
*
*/
function getPlaylistIdFromString (str) {
  try {
    const url = new URL(str)

    if (url.protocol === 'https:') {
      if (url.hostname === 'open.spotify.com' && url.pathname.startsWith('/playlist')) {
        return url.pathname.split('/')[2]
      }
      throw Error('Not a playlist url')
    } else if (url.protocol === 'spotify:') {
      if (url.pathname.startsWith('playlist')) {
        return url.pathname.split(':')[1]
      } else {
        throw Error('Not a playlist uri')
      }
    } else {
      throw Error('uri, but nothing we want to take a look at')
    }
  } catch (e) {
    if (e.message.startsWith('URL constructor:')) {
      // check if alphanumeric
      if (str.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)) {
        return str
      } else {
        throw Error('not alphanumeric')
      }
    } else {
      throw e
    }
  }
}

export {
  getPlaylistIdFromString,
}

import React from 'react'

export default function RequireLogin () {
  return (
    <>
      <p>In order to use spotimerge, you must log in first!</p>
      <h2>What is SpotiMerge?</h2>
      <p>SpotiMerge is a small tool, which allows to create one big playlist containing all the songs of multiple existing playlists on Spotify.</p>
      <h2>How does it work?</h2>
      <p>
        SpotiMerge stores all the playlists you want to merge together in the description of your new #SpotiMerge-Playlist.
        Whenever a #SpotiMerge-Playlist gets outdated, just visit SpotiMerge again and rebuilt your Playlist.
      </p>
    </>
  )
}

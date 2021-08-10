import React, { Fragment } from 'react'
import useStore from '../store'

export default function Views () {
    const [playlists, fetchExistingPlaylists] = useStore((state) => [state.spotimergePlaylists, state.fetchExistingPlaylists]);

    return (
        <Fragment>
            {playlists}
            <button onClick={fetchExistingPlaylists}>load playlists</button>
        </Fragment>
    )
}

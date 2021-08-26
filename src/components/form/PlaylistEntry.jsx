import styled from '@emotion/styled'
import { MinusCircleIcon } from '@heroicons/react/outline'
import React, { useEffect } from 'react'
import useStore from '../../store'
import Button from './Button'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr;
  align-items: center;
  border-bottom: 1px grey solid;

  &:last-child {
    border-bottom: 0;
  }
`

export default function PlaylistEntry ({ playlistId }) {
  const [playlists, fetchPlaylist, removePlaylistFromEditForm] = useStore((state) => [state.fetchedPlaylists, state.fetchPlaylist, state.removePlaylistFromEditForm])
  useEffect(() => {
    fetchPlaylist(playlistId)
  }, [])

  return (
    <Wrapper>
      <span>{playlists[playlistId]?.information?.name ?? playlistId}</span>
      <Button look={'icon'} onClick={() => { removePlaylistFromEditForm(playlistId) }}><MinusCircleIcon width="1.2em" /></Button>
    </Wrapper>
  )
}

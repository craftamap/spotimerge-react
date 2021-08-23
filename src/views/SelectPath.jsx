import React from 'react'
import styled from '@emotion/styled'
import useStore from '../store'
import { CollectionIcon, PlusIcon } from '@heroicons/react/outline'

const Wrapper = styled.div`
  display: flex;  
  margin: 40px auto;
  justify-content: space-evenly;

  button {
    border: solid 1px #eee;
    background-color: transparent;
    font-family: inherit;
    font-size: inherit;
    padding: 40px;
    border-radius: 4px;
    cursor: pointer;
  }

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`

export default function SelectPath () {
  const [switchToSelectPlaylist, switchToCreatePlaylist] = useStore((state) => [state.switchToSelectPlaylist, state.switchToCreatePlaylist])

  return (
    <>
      <h2>What do you want to do?</h2>
      <Wrapper>
        <button onClick={switchToSelectPlaylist}>
          <CollectionIcon width="36px" /><br />
          Select existing Playlist
        </button>
        <button onClick={switchToCreatePlaylist}>
          <PlusIcon width="36px" /><br />
          Create a new Playlist
        </button>
      </Wrapper>
    </>
  )
}

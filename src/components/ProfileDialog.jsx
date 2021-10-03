import styled from '@emotion/styled'
import React from 'react'
import useStore from '../store'
import Button from './form/Button'
import Loading from './Loading'

const Backdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  width: 100vw;
  height: 100vh;

  background-color: hsl(0 0% 0% / 80%);
`

const Dialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 400px;
  min-height: 300px;

  padding: 2em;
  background: white;
  border-radius: 4px;

  img {
    aspect-ratio: 1;
    object-fit: fill;
    border-radius: 50%;
  }
`

const DialogHeader = styled.div`
  display: flex;
  justify-content: right;
`

const DialogContent = styled.div`
  margin: auto 0;
  text-align: center;
`

export default function ProfileDialog () {
  const show = useStore((store) => store.profile.show)
  const showUserInformation = useStore((store) => store.showUserInformation)
  const loading = useStore((store) => store.profile.loading)
  const image = useStore((store) => store.profile.image)
  const displayName = useStore((store) => store.profile.displayName)

  if (!show) {
    return <></>
  }

  let content
  if (loading) {
    content = <Loading />
  } else {
    content = <>
      <img src={image} width="128px" />
      <p>Hey there, {displayName}!</p>
    </>
  }

  return (
    <Backdrop>
      <Dialog>
        <DialogHeader>
          <Button onClick={() => {
            showUserInformation(false)
          }}>Close</Button>
        </DialogHeader>
        <DialogContent>
          {content}
        </DialogContent>
      </Dialog>
    </Backdrop>
  )
}

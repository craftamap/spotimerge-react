import React from 'react'
import Loading from '../components/Loading'
import RequireLogin from './RequireLogin'
import SelectPlaylist from './SelectPlaylist'
import SelectPath from './SelectPath'
import EditPlaylist from './EditPlaylist'
import CreatePlaylist from './CreatePlaylist'
import useStore, { Stages } from '../store'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  max-width: 800px;
  margin: 24px auto;
  padding: 0 24px;
`

export default function Views () {
  const [isLoading, isLoggedIn, currentStage] = useStore((state) => [state.isLoading, state.auth.isLoggedIn, state.currentStage])

  let component

  if (isLoading) {
    component = (
      <Loading />
    )
  } else if (!isLoggedIn) {
    component = (
      <RequireLogin />
    )
  } else { // TODO: use dict here
    if (currentStage === Stages.SELECT_PATH) {
      component = <SelectPath />
    } else if (currentStage === Stages.SELECT_PLAYLIST) {
      component = <SelectPlaylist />
    } else if (currentStage === Stages.EDIT_PLAYLIST) {
      component = <EditPlaylist />
    } else if (currentStage === Stages.CREATE_PLAYLIST) {
      component = <CreatePlaylist />
    }
  }

  return <Wrapper>{component}</Wrapper>
}

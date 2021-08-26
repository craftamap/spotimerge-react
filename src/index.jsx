import React from 'react'
import ReactDOM from 'react-dom'

import Header from './components/Header'
import Views from './views/Views'
import useStore from './store'
import { Global, css } from '@emotion/react'
import Flags from './components/Flags'
import ProfileDialog from './components/ProfileDialog'

const GlobalStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

  html, body {
    margin: 0;
    font-family: 'Lato', sans-serif;
  }
`

function BasePage () {
  return (
    <>
      <Global styles={GlobalStyle}/>
      <Header />
      <Views />
      <Flags />
      <ProfileDialog />
    </>
  )
}

useStore.getState().loadTokenFromStorage()

ReactDOM.render(
    <BasePage />,
    document.getElementById('root'),
)

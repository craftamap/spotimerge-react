import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Header from './components/Header'
import Views from './views/Views'
import useStore from './store'
import { Global, css } from '@emotion/react'

const GlobalStyle = css`
  html, body {
    margin: 0;
    font-family: sans-serif;
  }
`

function BasePage () {
  return (
        <Fragment>
            <Global styles={GlobalStyle}/>
            <Header />
            <Views />
        </Fragment>
  )
}

useStore.getState().loadTokenFromStorage()

ReactDOM.render(
    <BasePage />,
    document.getElementById('root'),
)

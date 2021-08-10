import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Header from './components/Header'
import Views from './views/Views'

function BasePage () {
  return (
        <Fragment>
            <Header />
            <Views />
        </Fragment>
  )
}

ReactDOM.render(
    <BasePage />,
    document.getElementById('root')
)

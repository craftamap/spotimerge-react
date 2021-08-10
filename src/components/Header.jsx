import React from 'react'
import styled from 'styled-components'

import useStore from '../store'

const StyledHeader = styled.header`
    display: flex;
`

const openPopup = () => {
//  window.open('https://accounts.spotify.com/authorize', '', 'width=600,height=480')
  window.open('http://localhost:8080', '', 'width=600,height=480')
}

export default function Header (props) {
  const [isLoggedIn, token] = useStore((state) => [state.auth.isLoggedIn, state.auth.token])

  let links = <li><a onClick={openPopup}>Login</a></li>

  if (isLoggedIn) {
    links = <li>Logout {token}</li>
  }

  return (
        <StyledHeader>
            <h1>spotimerge</h1>
            <nav>
                <ul>
                    {links}
                </ul>
            </nav>
        </StyledHeader>
  )
}

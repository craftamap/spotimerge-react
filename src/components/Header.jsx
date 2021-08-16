import React from 'react'
import styled from '@emotion/styled'
import useStore from '../store'

const StyledHeader = styled.header`
  display: flex;
  
  justify-content: space-between; 
  align-items: center;
  
  background: black;
  color: white;

  h1 {
    font-family: sans-serif;
  }

  nav {
    padding: 4px;
    ul {
      list-style: none;
      padding: 0;

      li {
        display: inline-block;
        padding: 10px;
        transition: background .3s linear;
        border-radius: 4px;

        &:hover {
          background: #333;
          transition: background .3s linear;
        }
      }
    }
  }
`

const openPopup = () => {
  //  window.open('https://accounts.spotify.com/authorize', '', 'width=600,height=480')
  window.open('https://accounts.spotify.com/authorize?client_id=122f5228c6eb45ad865922a575c4a998&scope=user-read-private%20user-read-email%20playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private&response_type=token&state=123&redirect_uri=http:%2F%2Flocalhost:8000%2Fauth-flow-response.html', '', 'width=600,height=480')
}

export default function Header (props) {
  const [isLoggedIn, token] = useStore((state) => [state.auth.isLoggedIn, state.auth.token])
  let links = <li><a onClick={openPopup}>Login</a></li>

  if (isLoggedIn) {
    links = <li>Logout {token.substr(0, 10)}</li>
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

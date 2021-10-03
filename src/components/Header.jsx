import React from 'react'
import styled from '@emotion/styled'
import useStore from '../store'
import { redirectUri, clientId } from '../constants/defined'

const StyledHeader = styled.header`
  display: flex;
  
  justify-content: space-between; 
  align-items: center;
  
  background: black;
  color: white;
  padding: 0 1em;

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
  window.open(`https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(clientId)}&scope=user-read-private%20user-read-email%20playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private&response_type=token&state=123&redirect_uri=${encodeURIComponent(redirectUri)}`, '', 'width=600,height=480')
}

export default function Header (props) {
  const [isLoggedIn, removeTokenFromStorage, showUserInformation] = useStore((state) => [state.auth.isLoggedIn, state.removeTokenFromStorage, state.showUserInformation])
  let links = <li><a onClick={openPopup}>Login</a></li>

  if (isLoggedIn) {
    links = <>
      <li>
        <a onClick={() => {
          showUserInformation(true)
        }}>
          Profile
        </a>
      </li>
      <li>
        <a onClick={() => {
          removeTokenFromStorage()
          location.reload()
        }}>
          Logout
        </a>
      </li>
    </>
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

import React from 'react'
import styled from '@emotion/styled'
import { TailSpin } from 'svg-loaders-react'

const Wrapper = styled.div`
  margin: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export default function Loading () {
  return (
    <Wrapper>
      <TailSpin stroke="#000" style={{ filter: 'invert(1)' }} width="64px"/>
      <p>Loading...</p>
    </Wrapper>
  )
}

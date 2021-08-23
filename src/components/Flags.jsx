import React from 'react'
import styled from '@emotion/styled'
import useStore from '../store'
import { CheckCircleIcon } from '@heroicons/react/outline'

const Wrapper = styled.div`
  position: fixed;
  left: 3em; 
  bottom: 3em;
  height: 200px;
  width: 500px;
  pointer-events: none;
`

const Flag = styled.div`
  display: grid;
  grid-template-areas: 
    "icon ."
    "icon .";
  pointer-events: auto;
  border: 1px solid hsl(0,0%,70%);
  border-radius: 4px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 1em;
  margin-bottom: 1em;
  background: white;

  h1 {
    font-size: 1.2em;
    margin: 0 0 0.5em 0;
  }
  .icon {
    grid-area: icon;
    width: 24px;
    height: 24px;
    color: green;
  }
`

export default function Flags () {
  const flags = useStore((store) => store.flags)

  const flagContent = flags.map((flag, idx) => {
    return (
      <Flag key={idx}>
        <div className="icon"><CheckCircleIcon /></div>
        <h1>{flag?.title}</h1>
        <div>{flag?.content}</div>
      </Flag>
    )
  })

  return (
    <Wrapper>
      {flagContent}
    </Wrapper>
  )
}

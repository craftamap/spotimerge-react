import React from 'react'
import styled from '@emotion/styled'
import useStore from '../store'
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline'

const Wrapper = styled.div`
  position: fixed;
  left: 3em; 
  bottom: 3em;
  height: 150px;
  width: 500px;
  pointer-events: none;
`

const Flag = styled.div`
  display: grid;
  grid-template-areas: 
    "icon . close"
    "icon . .";
  grid-template-columns: 24px 1fr 16px;
  grid-gap: 0 8px;
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

  .close {
    width: 16px;
    height: 16px;
    background: white;
    visibility: hidden;
    cursor: pointer;
  }

  :hover .close {
    visibility: visible;
  }
`

export default function Flags () {
  const flags = useStore((store) => store.flags)
  const removeFlag = useStore((store) => store.removeFlag)

  const flagContent = flags.map((flag, idx) => {
    return (
      <Flag key={flag?.id}>
        <div className="icon"><CheckCircleIcon /></div>
        <h1>{flag?.title}</h1>
        <div className="close" onClick={() => {
          removeFlag(flag?.id)
        }}><XIcon/></div>
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

import styled from '@emotion/styled'

export default styled.button`
  border: 1px solid hsl(0,0%,80%);
  border-radius: 4px;
  padding: 0.5em;
  margin: 0.5em;
  text-decoration: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  &:hover {
    border: 1px solid hsl(0,0%,70%);
  }
  &:active {
    background: hsl(0,0%,90%);
  }
`

import styled from '@emotion/styled'

export default styled.button`
  border: 1px solid hsl(0,0%,80%);
  border-radius: 4px;
  padding: 0.5em;
  text-decoration: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  vertical-align: middle;
  &:hover {
    border: 1px solid hsl(0,0%,70%);
  }
  &:active {
    background: hsl(0,0%,90%);
  }
  // TODO: make beautiful
  ${props => props.look === 'icon' ? 'border: 0; border-radius: 0; &:hover { border: 0 }' : ''}
  ${props => props.loading ? 'color: transparent;' : ''}
  ${props => props.loading ? 'background-image: url(\'data:image/svg+xml,%3Csvg width="38" height="38" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient x1="8.042%25" y1="0%25" x2="65.682%25" y2="23.865%25" id="a"%3E%3Cstop stop-color="%23000" stop-opacity="0" offset="0%25"/%3E%3Cstop stop-color="%23000" stop-opacity=".631" offset="63.146%25"/%3E%3Cstop stop-color="%23000" offset="100%25"/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform="translate(1 1)" fill="none" fill-rule="evenodd"%3E%3Cpath d="M36 18c0-9.94-8.06-18-18-18" stroke="url(%23a)" stroke-width="2"%3E%3CanimateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/%3E%3C/path%3E%3Ccircle fill="%23000" cx="36" cy="18" r="1"%3E%3CanimateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E\'); background-repeat: no-repeat;background-position: center;background-size: 1em;' : ''}
`

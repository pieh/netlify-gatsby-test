const React = require('react')
import styled, { css } from 'styled-components'
import getScrollBarWidth from '../utils/scrollbar-width'

// hacky:
// because url is changed when we open modals, component get's remounted
// so we need to track previous props outside of actual component
const previousVisible = {}

class UnstyledOverlay extends React.Component {
  componentDidMount() {
    this.onVisibleChange(this.props.visible)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.onVisibleChange(nextProps.visible)
    }
  }

  onVisibleChange(visible) {
    const wereAllHidden = Object.values(previousVisible).every(val => val === false)
    previousVisible[this.props.id] = visible
    const areAllHidden = Object.values(previousVisible).every(val => val === false)

    if (wereAllHidden !== areAllHidden) {
      if (visible) {
        document.body.classList.add('modal-open')
        document.body.style.paddingRight = `${getScrollBarWidth()}px`
        window.dispatchEvent(new CustomEvent('modal', { detail: { open: true, scrollBarWidth: getScrollBarWidth() } }))
      } else {
        document.body.classList.remove('modal-open')
        document.body.style.paddingRight = ``
        window.dispatchEvent(new CustomEvent('modal', { detail: { open: false, scrollBarWidth: 0 } }))
      }
    }
  }

  render() {
    const { children, style, className } = this.props
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
}

const Overlay = styled(UnstyledOverlay)`
  // background-color: rgba(241, 239, 239, 0.94);
  background-color: rgba(255,255,255,0.92);
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index:999999999999999999999999;
  opacity: 0;
  display: none;
  overflow-y: auto;

  ${props => props.visible && css`
    opacity: 1;
    display: inline;
  `}
`
const OverlayFilter = styled.div`
  margin-bottom: 30px;
`
const OverlayTitle = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.35em;
  border: solid 1px;
  display: inline-block;
  padding: 15px 30px;
  margin: 0 auto;
  margin-bottom: 30px;
  margin-top: 30px;
  font-family: 'Lato';
  font-size: 30px;
`
const OverlayBody = styled.div`
  opacity: 1;
  margin: 0 auto;
  margin-top: 180px;
  padding-bottom: 60px;
  display: flex;
  justify-content: center;
  flex-direction: column;

  ${props => props.wide ? css`
      width: 90%;
  ` : css`
      width: 66%;
  `}
`

const OverlayHeader = styled.div`
  position: fixed;
  top: 30px;
  left: 0;
  width: 100%;
  padding: 0 12.5%;
`

export default { Overlay, OverlayHeader, OverlayTitle, OverlayFilter, OverlayBody }
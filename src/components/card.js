const React = require('react')
const range = require('range')
const ReactFlex = require('react-flex')
require('react-flex/index.css')
import Img from 'gatsby-image'
import Link from 'gatsby-link'
import kebabCase from 'lodash/kebabCase'

import styled, { css } from 'styled-components';

const CardWrapper = ({ link, children, ...rest }) => {
  if (link) {
    return <Link to={link} {...rest}>{children}</Link>
  } else {
    return <div {...rest}>{children}</div>
  }
}

class Card extends React.Component {
    render() {
      return (
        <CardWrapper link={this.props.link} className={this.props.className} style={this.props.style}>
            {this.props.type ?
            <h4 style={{marginBottom:15, opacity:0.5}}>{this.props.type}</h4> :
            null }

            {this.props.children}
        </CardWrapper>
      )
    }
}

const BASE_CARD_WIDTH = 350;
const FLEX = 100;
const MAX_WIDTH_CONSTANT = 1.25;
const ARTICLE_MULTIPLIER = 1.5;
const QUICK_FACT_MULTIPLIER = 1.5;

const StyledCard = styled(Card)`
  display: inline-block;
  height: 400px;
  flex: ${FLEX} ${FLEX} ${BASE_CARD_WIDTH}px;
  background-color: white;
  // border: solid 5px white;
  // &:hover {
  //   border: solid 5px beige;
  // }
  background-color: white;
  transition: all .1s;
  &:hover {
    background-color:rgb(247, 240, 236);
    transition: all .1s;
  }
  -webkit-box-shadow: 0px 2px 15px 0px rgba(179,179,179,0.38);
  -moz-box-shadow: 0px 2px 15px 0px rgba(179,179,179,0.38);
  box-shadow: 0px 2px 15px 0px rgba(179,179,179,0.38);
  margin-bottom: 30px;
  font-family: "ff-tisa-web-pro";
  vertical-align: top;
  margin-right: 30px;
  max-width: ${BASE_CARD_WIDTH * MAX_WIDTH_CONSTANT}px

  ${props => props.background && css`
    background-image: url('${props.background}');
    background-size: cover;
  `}

  ${props => props.type == `Article` && css`
    flex: ${FLEX * ARTICLE_MULTIPLIER} ${FLEX * ARTICLE_MULTIPLIER} ${BASE_CARD_WIDTH * ARTICLE_MULTIPLIER}px;
    max-width: ${BASE_CARD_WIDTH * MAX_WIDTH_CONSTANT * ARTICLE_MULTIPLIER}px;
  `}

  ${props => props.type == `QuickFact` && css`
    flex: ${FLEX * QUICK_FACT_MULTIPLIER} ${FLEX * QUICK_FACT_MULTIPLIER} ${BASE_CARD_WIDTH * QUICK_FACT_MULTIPLIER}px;
    max-width: ${BASE_CARD_WIDTH * MAX_WIDTH_CONSTANT * QUICK_FACT_MULTIPLIER}px;
  `}

  ${props => props.link && css`
    color: inherit;
    text-decoration: inherit;
  `}
`;

export default StyledCard;


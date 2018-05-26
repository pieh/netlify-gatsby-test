const React = require('react')
import AllClips, { Clip } from '../components/allClips.js'
import styled from 'styled-components'
import Link from 'gatsby-link'
import {
  getCards,
  QuickFactCard,
  FAQCard,
  ClipCard,
  ArticleCard
} from '../components/subtheme'

const DarkBackground = styled.div`
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -999999;
  height: 100%;
  width:100%;
`
const ChosenClipCard = styled.div`
  height: 414px;
  width: 720px;
  margin-bottom: 30px;
  margin-right: 30px;
  display: inline-block;
  vertical-align:top;
`
const ChosenClipCaption = styled.div`
  font-size: 22px;
  font-weight: 400;
  line-height:1.25;
  display: inline-block;
  padding-bottom: 30px;
  color:#ffe4c1;
  letter-spacing: 0.02em;
`
const Chosen = styled.div`
  background-color:#404040;
  margin-bottom: 60px;
  padding: 30px;
  display: flex;
  align-items: center;
`

export const ChosenClip = ({ clip, link }) =>  {
	return (
		<Chosen>
		  <ChosenClipCard>
			 <iframe width='720px' height='100%' src={`${clip.field_external_video_url && clip.field_external_video_url.uri}?title=0&byline=0&portrait=0`} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
			</ChosenClipCard>
     <ChosenClipCaption> {clip.title}</ChosenClipCaption>
		</Chosen>
	)
}

class ClipTemplate extends React.Component {
  constructor(){
    super()
    this.state = {}
  }
  render() {
    const { data } = this.props
    return (
      <div className='wrapper'>
        <ChosenClip clip={data.nodeClip} />
        <div style={{ padding: 10, margin: 10, border: `1px solid black`}}>
          <button onClick={() => { this.setState({ teaching: false}) }}>
            All Content
          </button>
          <button onClick={() => { this.setState({ teaching: true}) }}>
            Teaching
          </button>
          {
            (data.nodeClip.relationships.field_re || [])
            .filter(node => (!this.state.teaching || node.field_include_in_the_teaching_se) )
            .map((node, i) => {
                if (node.__typename == `node__article`) {
                  return (
                    <ArticleCard
                      i={i}
                      article={node}
                      relatedContent
                    />
                  )
                } else if (node.__typename == `node__faq`) {
                  return (
                    <FAQCard
                      i={i}
                      faq={node}
                    />
                  )
                } else if (node.__typename == `node__clip`) {
                  return (
                    <ClipCard
                      i={i}
                      clip={node}
                      playable
                    />
                  )
                }
              }
            )
          }
        </div>
        <h4>All Clips</h4>
        <AllClips data={data}/>
      </div>
    )
  }
}

export default ClipTemplate;

export const clipQuery = graphql`
  query clipQuery($id: String) {
    nodeClip(id: { eq: $id }) {
      ...ClipFragment
    }
    allNodeClip {
      edges {
        node {
          ...ClipFragment
        }
      }
    }
}
`
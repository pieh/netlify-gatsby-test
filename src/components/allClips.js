import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import kebabCase from 'lodash/kebabCase'

const ClipCard = styled.div`
	width: 300px;
	background-color:#ffe4c1;
	display:inline-block;
	vertical-align: top;
	margin-right:30px;
	margin-bottom: 30px;
	transition: all .3s;
	&:hover {
	  transition: all .3s;
	}
	cursor: pointer;
`
const ClipPoster = styled.div`
	height:200px;
	width:100%;
	background-color:red;
	background-size:cover;
	background-position: center;
    background-image: ${props => props.background ?  `url(${props.background})` : `none`};
`

export const Clip = ({ clip, link }) =>  {
	return (
			<ClipCard>
				{
					link ?
						<Link to={`/clips/${kebabCase(clip.title)}`}>
							<ClipPoster background={clip.relationships.field_poster_image && clip.relationships.field_poster_image.localFile.publicURL} >

							</ClipPoster>
						</Link> :
						<iframe src={`${clip.field_external_video_url && clip.field_external_video_url.uri}?title=0&byline=0&portrait=0`} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
				}
				<div className="caption">
					{clip.title}
				</div>
			</ClipCard>
		)
}


const AllClips = ({ data }) => (
  <div>
    {data.allNodeClip.edges.map((edge, i) => (
      <Clip clip={edge.node} link={true} />
    ))}
  </div>
)

export default AllClips


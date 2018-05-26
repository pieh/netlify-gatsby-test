import React from 'react'
import Link from 'gatsby-link'
import kebabCase from 'lodash/kebabCase'
import styled from 'styled-components'
import {ClipPoster} from '../components/allClips.js'

// const ContentNodeComponent = ({ data }) => (
//   <li>
//     <strong>{data.__typename}</strong>: {data.title}
//   </li>
// )

// const SubThemeComponent = ({ data }) => (
//   <li>
//     Subtheme: <strong>{data.name}</strong>
//     {data.relationships.contentNodes ? (
//       <ul>
//         {data.relationships.contentNodes.map(contentNode => (
//           <ContentNodeComponent data={contentNode} />
//         ))}
//       </ul>
//     ) : (
//       <span style={{ color: 'red' }}> (no contentNodes)</span>
//     )}
//   </li>
// )

const HomeBackground = styled.div`
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -999999;
  height: 100%;
  width:100%;
`

const HomeThemeImage = styled.div`
  height: 400px;
  color: white;
  font-family: 'Lato';
  font-size:24px;
  line-height:1.5;
  text-align: center;
  letter-spacing: 0.04em;
  background-position: center center;
  background-size: 120%;
  transition: all .5s;
  &:hover {
    background-size:250%;
    transition: all 4.5s;
  }
  background-image: ${props =>
                      props.background ? `url(${props.background})` : `none`};
`



const ThemeComponent = ({ data }) => (
  <div style={{
    backgroundColor: 'red',
    width: '50%',
    height: 400,
    marginBottom: 0,
    marginRight: 0,
    display:'inline-block',
    verticalAlign:'top',
    borderRadius: 0,
    overflow: 'hidden'

    }}
  >
    <Link style={{textDecoration:'none'}} to={`/themes/${kebabCase(data.name)}`}>
      <HomeThemeImage background={data.relationships.field_theme_image && data.relationships.field_theme_image.localFile.publicURL}>
       <div className='totalDimmer'>
        {data.name}
        </div>
      </HomeThemeImage>
    </Link>
 
    {/* {data.relationships.subthemes ? (
      <ul>
        {data.relationships.subthemes.map(subTheme => (
          <SubThemeComponent data={subTheme} />
        ))}
      </ul>
    ) : (
      <div>No subthemes</div>
    )} */}
  </div>
)

export default ({ data }) => (
  
  <div className='wrapper'>
  <HomeBackground />
 
    {data.allTaxonomyTermThemes.edges.map(({ node }) => (
      <ThemeComponent data={node} />
    ))}
  </div>
)

export const query = graphql`
  query IndexQuery {
    allTaxonomyTermThemes {
      edges {
        node {
          id
          name
          relationships {
            field_theme_image {
              localFile {
                publicURL
              }
            }
            subthemes: backref_field_belongs_to_theme {
              name
              id
              relationships {
                contentNodes: backref_field_belongs_to_subtheme {
                  __typename
                  ... on node__article {
                    title
                  }
                  ... on node__faq {
                    title
                  }
                  ... on node__clip {
                    title
                  }
                  ... on node__quickfact {
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

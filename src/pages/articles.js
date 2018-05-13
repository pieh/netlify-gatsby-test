import React from 'react'
import styled from 'styled-components'
import './articles.css'
import Link from 'gatsby-link'
import kebabCase from 'lodash/kebabCase'



// const ContentNodeComponent = ({ data }) => <li>{data.name}</li>

// const SubThemeComponent = ({ data }) => (
//   <li>
//     Subtheme: <strong>{data.name}</strong> <code>{data.id}</code>
//     {/* {data.relationships.field_belongs_to_theme ? (
//       <ul>
//         {data.relationships.field_belongs_to_theme.map(article => (
//           <ContentNodeComponent data={article} />
//         ))}
//       </ul>
//     ) : (
//       <span style={{ color: 'red' }}> (no articles)</span>
//     )} */}
//   </li>
// )


// .card:nth-child(odd) .card__image {
//   /* flexbox can change order of rendered elements*/
//   order: 2;
// }

const ArticleTitle = styled.div`
  font-family: 'Lato';
  font-size:36px;
  line-height:1.25;
  letter-spacing: 0.01em;
  margin-bottom: 15px;
`
const ArticleImage = styled.div`
  background-image: ${props =>
    props.background ? `url(${props.background})` : `none`};
`

const ArticleSummary = ({ data }) => {
  console.log(data)
  return (
      <div className={"articleCard"}>
        <ArticleImage
        background={
          data.relationships.field_main_image &&
          data.relationships.field_main_image.localFile.publicURL
        }
        className={"articleCardImage"}>
          {data.relationships.field_theme_image && data.relationships.field_theme_image.localFile.publicURL}
        </ArticleImage>
        
        <div style={{ margin: 60}}>
          <ArticleTitle>
            <Link style={{  color: 'rgb(191, 191, 191)', textDecoration: 'none'}} to={`/articles/${kebabCase(data.title)}`}>{data.title}</Link>
          </ArticleTitle>
          <h6>{data.field_author && data.field_author.processed}</h6>
            <div className="card-large-text">
              {data.field_medium_version && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.field_medium_version.processed,
                  }}
                />

              )}
            </div>
          </div>
        {/* {data.relationships.field_belongs_to_subtheme ? (
        <ul>
          {data.relationships.field_belongs_to_subtheme.map(subTheme => (
            <ArticleSummary data={subTheme} />
          ))}
        </ul>
      ) : (
        <div>No subthemes</div>
      )} */}
      </div>
  )
}

export default ({ data }) => (
  <div className={"articles"}>
    {data.allNodeArticle.edges.map((edge, i) => (
      <ArticleSummary data={edge.node} />
    ))}
  </div>
)

export const query = graphql`
  query ArticlesQuery {
    allNodeArticle {
      edges {
        node {
          id
          title
          field_author {
            processed
          }
          field_medium_version {
            processed
          }
          relationships {
            field_main_image {
              id
              localFile {
                publicURL
              }
            }
            field_belongs_to_subtheme {
              id
              name
              relationships {
                field_belongs_to_theme {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`

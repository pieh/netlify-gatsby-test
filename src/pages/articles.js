import React from 'react'

// const ContentNodeComponent = ({ data }) => <li>{data.name}</li>

const SubThemeComponent = ({ data }) => (
  <li>
    Subtheme: <strong>{data.name}</strong> <code>{data.id}</code>
    {/* {data.relationships.field_belongs_to_theme ? (
      <ul>
        {data.relationships.field_belongs_to_theme.map(article => (
          <ContentNodeComponent data={article} />
        ))}
      </ul>
    ) : (
      <span style={{ color: 'red' }}> (no articles)</span>
    )} */}
  </li>
)

const ThemeComponent = ({ data, right }) => {
  console.log(data)
  return (
    <div style={{ float: right ? 'right' : 'left' }}>
      Article: <strong>{data.title}</strong>
      {data.field_medium_version && (
        <div
          dangerouslySetInnerHTML={{
            __html: data.field_medium_version.processed,
          }}
        />
      )}
      {/* {data.relationships.field_belongs_to_subtheme ? (
      <ul>
        {data.relationships.field_belongs_to_subtheme.map(subTheme => (
          <SubThemeComponent data={subTheme} />
        ))}
      </ul>
    ) : (
      <div>No subthemes</div>
    )} */}
    </div>
  )
}

export default ({ data }) => (
  <ul>
    {data.allNodeArticle.edges.map((edge, i) => (
      <ThemeComponent data={edge.node} right={i % 2} />
    ))}
  </ul>
)

export const query = graphql`
  query ArticlesQuery {
    allNodeArticle {
      edges {
        node {
          id
          title
          field_medium_version {
            processed
          }
          relationships {
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

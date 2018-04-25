const React = require('react')
const ReactFlex = require('react-flex')
require('react-flex/index.css')
import Img from 'gatsby-image'


import Card from '../components/card.js'
import SubthemeSection from '../components/subtheme.js'

const FlipMove = require('react-flip-move');
import styled from 'styled-components';

const ThemeDescription = styled.div`
  color: white;
  font-weight: normal;
  margin-top: 30px;
  font-size: 24px;
  line-height: 1.6;
  width: 630px;
`
const ThemeHeader = styled.div`
  width: 100%;
  height: 100vh;
  background-image: ${props => props.background ?  `url(${props.background})` : `none`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: lightgrey;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: -999;
`

const ThemeIntro = styled.div`
  margin-left: 30px;
  margin-top: 120px;
`

const ThemeMain = styled.div`
  position: absolute;
  top: 100vh;
  width: 100%;
`

class ThemePage extends React.Component {
  render() {
    const theme = this.props.data.taxonomyTermThemes
    return (
      <div>
        <ThemeHeader background={theme.relationships.field_theme_image && theme.relationships.field_theme_image.localFile.publicURL}>
          <ThemeIntro>
            <h1>{theme.name}</h1>
            {theme.description ? (
              <ThemeDescription
                dangerouslySetInnerHTML={{ __html: theme.description.processed }}
              />
            ) : null}
          </ThemeIntro>
         
        </ThemeHeader>
        <ThemeMain>
          {theme.relationships.subthemes.map(subtheme => (
                    <SubthemeSection data={subtheme} />
                  ))}
        </ThemeMain>
        
        <br />
      </div>
    )
  }
}

export default ThemePage

export const pageQuery = graphql`
  query themeQuery($id: String) {
    taxonomyTermThemes(id: { eq: $id }) {
      id
      name
      description {
        processed
      }
      relationships {
        field_theme_image {
          localFile {
            publicURL
            childImageSharp {
              sizes(maxWidth: 960, quality: 90) {
                ...GatsbyImageSharpSizes
              }
            }
          }
        }

        subthemes: backref_field_belongs_to_theme {
          name
          id
          description {
            processed
          }
          relationships {
            articles: backref_field_belongs_to_subtheme_node_article {
              title
              field_short_version {
                processed
              }
            }
            clips: backref_field_belongs_to_subtheme_node_clip {
              title
              relationships {
                field_clip {
                  localFile {
                    publicURL
                    internal {
                      mediaType
                    }
                  }
                }
              }
            }
            faqs: backref_field_belongs_to_subtheme_node_faq {
              title
              field_expert_1 {
                value
                format
                processed
              }
            }
            quickfacts: backref_field_belongs_to_subtheme_node_quickfact {
              title
            }
          }
        }
      }
    }
  }
`

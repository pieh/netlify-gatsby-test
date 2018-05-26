const React = require('react')
const ReactFlex = require('react-flex')
const queryString = require('query-string');

require('react-flex/index.css')
import Img from 'gatsby-image'
import kebabCase from 'lodash/kebabCase'
import Card from '../components/card.js'
import SubthemeSection from '../components/subtheme.js'

const FlipMove = require('react-flip-move');
import styled from 'styled-components';


const ThemeTitle = styled.div`
  margin-top: 10vh;
  margin-bottom:15px;
  color: inherit;
  font-family: "lato";
  font-weight: 800;
  text-rendering: optimizeLegibility;
  font-size: 48px;
  line-height: 1
  letter-spacing: 0.04em;
  color:white;
  text-align: center;
`
const ThemeDescription = styled.div`
  font-weight: 200;
  font-size: 18px;
  line-height: 1.75;
  letter-spacing: 0.02em;
  position:relative;
  z-index:99999;
  max-width: 800px;
  margin: 0 auto;
  color:white;
  text-align: center;
`
const ThemeHeader = styled.div`
  width: 100%;
  height: 100vh;
  // opacity: 0.8;
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
const HeaderDimmer = styled.div`
  width: 100%;
  position: absolute;
  left:0;
  right:0;
  top:0;
  z-index: 99999999;
  height:210px;
  mix-blend-mode: multiply;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+16,fcfcfc+100&0.93+16,0+100 */
  background: -moz-linear-gradient(top, rgba(0,0,0,0.93) 16%, rgba(252,252,252,0) 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, rgba(0,0,0,0.93) 16%,rgba(252,252,252,0) 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, rgba(0,0,0,0.93) 16%,rgba(252,252,252,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ed000000', endColorstr='#00fcfcfc',GradientType=0 ); /* IE6-9 */
`
const Dimmer = styled.div`
  width: 100%;
  position: absolute;
  left:0;
  right:0;
  bottom:0;
  height:41vh;
  mix-blend-mode: multiply;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+61&0+0,0.93+69 */
  background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.82) 61%, rgba(0,0,0,0.93) 69%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.82) 61%,rgba(0,0,0,0.93) 69%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.82) 61%,rgba(0,0,0,0.93) 69%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#ed000000',GradientType=0 ); /* IE6-9 */
`

const ThemeIntro = styled.div`
  position: absolute;
  bottom: 5vh;
  left: 50%;
  margin-left: -400px;
  z-index:99999999999999999999;

`
const ThemeMain = styled.div`
  position: absolute;
  top: 100vh;
  width:100%;
`

class ThemePage extends React.Component {
  render() {
    const theme = this.props.data.taxonomyTermThemes

    const queryParams = queryString.parse(this.props.location.search);

    const getShortname = (subtheme) => {
      const parts = subtheme.name.split('-');
      return encodeURIComponent(kebabCase(parts[parts.length - 1]))
    }

    return (
      <div>
       
        <ThemeHeader background={theme.relationships.field_theme_image && theme.relationships.field_theme_image.localFile.publicURL}>
        <HeaderDimmer />
         <Dimmer />
           <ThemeIntro>
            <ThemeTitle>{theme.name}</ThemeTitle>
            {theme.description ? (
              <ThemeDescription
                dangerouslySetInnerHTML={{ __html: theme.description.processed }}
              />
            ) : null}
          </ThemeIntro>
        </ThemeHeader>
        <ThemeMain>
          {
            theme.relationships.subthemes.sort((a, b) => {
                var nameA = getShortname(a);
                var nameB = getShortname(b);
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
              }).map(subtheme => (
                <SubthemeSection
                  data={subtheme}
                  name={getShortname(subtheme)}
                  filter={queryParams[getShortname(subtheme)]}
                  queryParams={queryParams}
                />
              ))
          }
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
              ...ArticleFragment
            }
            clips: backref_field_belongs_to_subtheme_node_clip {
              ...PosterImageClipFragment
            }
            interviews: backref_field_which_subtheme_does_this_b_node_interview {
              ...InterviewFragment
            }
            faqs: backref_field_belongs_to_subtheme_node_faq {
              ...FAQFragment
            }
          }
        }
      }
    }
  }
`

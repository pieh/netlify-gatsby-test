const React = require('react')
import styled, { css } from 'styled-components'
import {
  getCards,
  QuickFactCard,
  FAQCard,
  ClipCard,
  ArticleCard
} from '../components/subtheme'
import { Overlay, OverlayHeader, OverlayTitle, OverlayFilter, OverlayBody }  from '../components/overlay'
const queryString = require('query-string');
import kebabCase from 'lodash/kebabCase'
import Link, { navigateTo } from 'gatsby-link';

// const MainContent = styled.div`
//   max-width: 700px;
//   margin-left: 48%;
//   margin-right: 12%;
// `
const LargeCalloutText = styled.div`

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
const ArticleHeader = styled.div`
  width: 100%;
  height: 100vh;
  background-image: ${props =>
    props.background ? `url(${props.background})` : `none`};
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

const ArticleMain = styled.div`
  background-color: rgba(255, 255, 255, 1);
  padding: 30px;
  margin-top: 45vh;
  position: relative;
  z-index:99999999;
`
const ArticleTitle = styled.div`
    font-size: 60px;
    width: 60%;
    margin-bottom: 15px;
    line-height: 1.25;
    color: white;
    z-index: 99999999999999;
    position: relative;
    margin-top: 43vh;
    left: 120px;
    font-family: 'Lato';
    font-weight: 200;
`


class QuickFactOverlay extends React.Component {
  render() {
    const { quickFact, transition } = this.props

    if (!quickFact) return (
      <Overlay key="quickfact" id="quickfact" visible={false}/>

    )
    const quickClips = quickFact.relationships.field_related_content || [];

    const quickClipLinks = {
      articles: [],
      clips: [],
      faqs: [],
      quickFacts: []
    }

    quickClips.forEach(item => {
      if (item.__typename == `node__faq`) {
        quickClipLinks.faqs.push(item)
      } else if (item.__typename == `node__article`) {
        quickClipLinks.articles.push(item)
      } else if (item.__typename == `node__clip`) {
        quickClipLinks.clips.push(item)
      }
    })

    return (
      <Overlay key="quickfact" id="quickfact" visible={!!quickFact} style={transition && transition.style}>
        <OverlayBody>
          <OverlayHeader>
            <div onClick={this.props.closeHandler} style={{float: `right`, color: `red`, cursor: `pointer`}}>
              <b>Close</b>
            </div>
            <h3>{quickFact.title}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: quickFact.field_quickfact.processed,
              }}
            />
          </OverlayHeader>
          <div style={{ width: `100%`, display: `flex`, }}>
            {
              getCards(quickClipLinks, null, null, true).slice(0,2)
            }
          </div>
        </OverlayBody>
      </Overlay>
    )
  }
}

class TagOverlay extends React.Component {
  render() {
    const { tag, transition, queryParams = {} } = this.props

    if (!tag) return (
      <Overlay key="tag" id="tag" visible={!!tag}/>
    )

    const quickClipLinks = {
      articles: tag.relationships.backref_field_tags_node_article ,
      faqs: tag.relationships.backref_field_tag_node_faq,
      clips: tag.relationships.backref_field_t_node_clip,
      quickFacts: []
    }

    const itemExists = itemTag => (({
      faq: tag.relationships.backref_field_tag_node_faq,
      article: tag.relationships.backref_field_tags_node_article,
      clip: tag.relationships.backref_field_t_node_clip,
    })[itemTag])

    return (
      <Overlay key="tag" id="tag" visible={!!tag} style={transition && transition.style}>
        <OverlayBody wide>
            
          <OverlayHeader>
            <div onClick={this.props.closeHandler} style={{float: `right`, color: `red`, cursor: `pointer`}}>
              <strong>Close</strong>
            </div>
            <div style={{
              textAlign:'center'
            }}>
              <OverlayTitle>{tag.name}</OverlayTitle>
            </div>
           
          </OverlayHeader>
          <div>
            <OverlayFilter>
            <p style={{textAlign:'center', fontFamily:'Lato', fontWeight:'800', position:'relative', top:-15}}>Brief glossary-style description text here explaining tag and maybe raising issues in which it comes up.</p>
              {
                [`faq`, `article`, `clip`].filter(itemType => itemExists(itemType)).map(articleType => (
                  <span
                    key={articleType}
                    style={{ marginRight: 20, cursor: `pointer` }}
                    onClick={ () => {
                      const newQueryParams = { ... queryParams }
                      if (newQueryParams[`type`] == articleType){
                        delete newQueryParams[`type`]
                      } else {
                        newQueryParams[`type`] = articleType;
                      }
                      navigateTo(`?${queryString.stringify(newQueryParams)}`)
                    }}
                  >
                    { articleType }
                  </span>
                ))
              }
            </OverlayFilter>
            <div style={{ width: `100%`, display: 'flex', 'flexWrap': 'wrap'}}>
              {
                getCards(quickClipLinks, queryParams[`type`], null, true)
              }
            </div>
          </div>
        </OverlayBody>
      </Overlay>
    )
  }
}

class SingleArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data, transition } = this.props
    const queryParams = queryString.parse(this.props.location.search);
    const quickFact = queryParams.quickfact ?
      (data.nodeArticle.relationships.field_article_related_content || []).filter(node => (node.__typename === `node__quickfact` && kebabCase(node.title) == queryParams.quickfact)
      )[0] :
      null

    console.log(`quickfact`)
    console.log(quickFact)

    const tag = queryParams.tag ?
      (data.nodeArticle.relationships.field_tags || []).filter(tag => (kebabCase(tag.name) == queryParams.tag)
      )[0] :
      null

    return (
      <div className="row">
        <QuickFactOverlay
          quickFact={quickFact}
          closeHandler={() => {
            navigateTo(`?`)
          }}
          transition={transition}
        />
        <TagOverlay
          queryParams={queryParams}
          tag={tag}
          transition={transition}
          closeHandler={() => {
            navigateTo(`?`)
          }}
        />
        <HeaderDimmer />
        <ArticleHeader
          background={
            data.nodeArticle.relationships.field_main_image &&
            data.nodeArticle.relationships.field_main_image.localFile.publicURL
          }
        >
        <ArticleTitle>{data.nodeArticle.title}</ArticleTitle>
        <h4 style={{marginBottom: 45, color:'white'}}>By {data.nodeArticle.field_author && data.nodeArticle.field_author.processed}</h4>
        <Dimmer />
        </ArticleHeader>
          <ArticleMain style={{
            marginLeft: 90
          }} className="column _60">
            <LargeCalloutText
              style={{
                fontSize: 24,
                fontWeight: 'normal',
                lineHeight: 1.5
              }}
              dangerouslySetInnerHTML={{
                __html: data.nodeArticle.field_large_callout_text.processed,
              }}
            />
            <div
              style={{lineHeight:1.7}}
              dangerouslySetInnerHTML={{
                __html: data.nodeArticle.field_full_version.processed,
              }}
            />
            <hr style={{width:60, marginTop:60, marginBottom:15}} />
            <p style={{
              color: 'lightgrey',
              letterSpacing: '0.04em',
              fontStyle: 'italic',
              fontFamily: 'Lato',

            }}>NOTE: <span dangerouslySetInnerHTML={{
                __html: data.nodeArticle.field_old_article_discl && data.nodeArticle.field_old_article_discl.processed,
              }}
              /></p>

          </ArticleMain>
         
        
          <div className="column">
         
            
            <div style={{
            width:180,
            height:180,
            backgroundColor:'red',
            marginBottom:15,
            overflow:'hidden',
            display:'inline-block',
            borderRadius:'50%',
            marginTop:400
          }}>
            <img style={{
              width:300,
             

            }} src={
               data.nodeArticle.relationships.field_author_image &&
               data.nodeArticle.relationships.field_author_image.localFile.publicURL
            } />
          </div>
            {
              (data.nodeArticle.relationships.field_tags || []).map(tag =>
                <Link
                  to={`?${queryString.stringify({ ...queryParams, tag: kebabCase(tag.name) })}`}
                  key={`tag-${tag.name}`}
                  className={'tag'}
                >
                  <b>{tag.name}</b>
                </Link>
              )
            }
            <div style={{height: 200}}/>
            <button onClick={() => { this.setState({ teaching: false}) }}>
              All Content
            </button>
            <button onClick={() => { this.setState({ teaching: true}) }}>
              Teaching
            </button>
            {
              (data.nodeArticle.relationships.field_article_related_content || [])
              .filter(node => (!this.state.teaching || node.field_include_in_the_teaching_se) )
              .map((node, i) => {
                  if (node.__typename == `node__quickfact`) {
                    const newQueryParams = { ...queryParams, quickfact: kebabCase(node.title) }

                    return (
                      <QuickFactCard
                        link={`?${queryString.stringify(newQueryParams)}`}
                        quickfact={node}
                        i={i}
                        style={{ cursor: `pointer`, textAlign:'left', border: `1px solid #888888`, padding: 20}}
                      />
                    )
                  } else if (node.__typename == `node__article`) {
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
      </div>
    )
  }
}


export default SingleArticle;

export const pageQuery = graphql`
  query singleQuery($id: String) {
    nodeArticle(id: { eq: $id }) {
      id
      field_old_article_discl {
        processed
      }
      field_author {
        processed
      }
      field_author_bio {
        processed
      }
      field_copyright {
        processed
      }
      title
      relationships {
        field_article_related_content {
          __typename
          ... on node__faq {
            ...FAQFragment
          }
          ... on node__clip {
            ...PosterImageClipFragment
          }
          ... on node__article {
            ...ArticleFragment
          }
          ... on node__quickfact {
            ...QuickfactWithRelatedContentFragment
          }
        }
        field_tags {
          name
          relationships {
            backref_field_tags_node_article {
              ...ArticleFragment
            }
            backref_field_tag_node_faq {
              ...FAQFragment
            }
            backref_field_t_node_clip {
              ...PosterImageClipFragment
            }
          }
        }
        field_author_image {
          localFile {
            publicURL
          }
        }
        field_main_image {
          localFile {
            publicURL
          }
        }
      }
      field_large_callout_text {
        processed
      }
      field_full_version {
        processed
      }
    }
  }
`

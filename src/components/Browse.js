import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadTexts } from 'actions/text'

@connect(({ texts }) => ({ texts: texts.get('browse') }), {
  loadTexts,
})
class Browse extends Component {
  componentDidMount() {
    const { location, texts, loadTexts } = this.props
    if (texts.size) {
      return
    }

    const query = new URLSearchParams(location.search)
    const language = query.get('language')
    loadTexts({ language })
  }

  render() {
    console.log(this.props.texts.toJS())
    return <div>{'Browse'}</div>
  }
}

export default Browse

export function createText(body) {
  return {
    type: 'API:TEXT_CREATE',
    payload: {
      url: '/texts',
      method: 'POST',
      body,
    },
  }
}

export function loadTexts(language) {
  return {
    type: 'API:LOAD_TEXTS',
    payload: {
      url: '/texts',
      query: {
        language,
      },
    },
  }
}

export function starText(id) {
  return {
    type: 'API:STAR_TEXT',
    payload: {
      url: `/texts/${id}/star`,
      method: 'PUT',
    },
  }
}

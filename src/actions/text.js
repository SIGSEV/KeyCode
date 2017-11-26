import { push } from 'react-router-redux'

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

export function loadTexts(query = {}) {
  return {
    type: 'API:LOAD_TEXTS',
    payload: {
      url: '/texts',
      query,
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

export function gradeText(id, grade) {
  return {
    type: 'API:GRADE_TEXT',
    payload: {
      url: `/texts/${id}/grade`,
      method: 'PUT',
      body: {
        grade,
      },
    },
  }
}

export function deleteText(id) {
  return async dispatch => {
    await dispatch({
      type: 'API:DELETE_TEXT',
      payload: {
        url: `/texts/${id}`,
        method: 'DELETE',
      },
    })

    dispatch(push('/'))
  }
}

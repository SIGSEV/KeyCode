import Home from 'components/Home'
import Race from 'components/Race'
import Pricing from 'components/Pricing'
import Language from 'components/Language'
import User from 'components/User'
import CreateText from 'components/CreateText'

import { loadRace } from 'actions/race'
import { loadTexts } from 'actions/text'

export default [
  {
    path: '/',
    exact: true,
    component: Home,
    load: ({ dispatch }) => dispatch(loadTexts()),
  },
  {
    path: '/new',
    exact: true,
    component: CreateText,
  },
  {
    path: '/r/:id',
    component: Race,
    load: ({ dispatch, params: { id } }) => dispatch(loadRace(id)),
  },
  {
    path: '/u/:id',
    component: User,
  },
  {
    path: '/pricing',
    component: Pricing,
  },
  {
    path: '/l/:id',
    component: Language,
    load: ({ dispatch, params: { id } }) => dispatch(loadTexts(id)),
  },
]

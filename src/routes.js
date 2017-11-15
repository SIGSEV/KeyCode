import Home from 'components/Home'
import Race from 'components/Race'
import Pricing from 'components/Pricing'
import Language from 'components/Language'
import User from 'components/User'
import CreateText from 'components/CreateText'
import LeaderBoard from 'components/LeaderBoard'

import { loadRace } from 'actions/race'
import { loadTexts } from 'actions/text'
import { loadLeaders } from 'actions/leaders'

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
    path: '/leaderboard',
    exact: true,
    component: LeaderBoard,
    load: ({ dispatch }) => dispatch(loadLeaders()),
  },
  {
    path: '/r/:id',
    component: Race,
    load: ({ dispatch, params: { id } }) => dispatch(loadRace(id)),
  },
  {
    path: '/l/:id',
    component: Language,
    load: ({ dispatch, params: { id } }) =>
      Promise.all([dispatch(loadTexts(id)), dispatch(loadLeaders(id))]),
  },
  {
    path: '/u/:id',
    component: User,
  },
  {
    path: '/pricing',
    component: Pricing,
  },
]

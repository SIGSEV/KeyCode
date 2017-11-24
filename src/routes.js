import Home from 'components/Home'
import Race from 'components/Race'
import Pricing from 'components/Pricing'
import User from 'components/User'
import CreateText from 'components/CreateText'
import LeaderBoard from 'components/LeaderBoard'
<<<<<<< HEAD
import Eval from 'components/pages/Eval'
=======
import Browse from 'components/Browse'
>>>>>>> setup new browse page for my wonderful frlend

import { loadUser } from 'actions/user'
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
    path: '/browse',
    component: Browse,
    load: ({ dispatch, query }) => dispatch(loadTexts(query)),
  },
  {
    path: '/u/:name',
    component: User,
    load: ({ dispatch, params: { name } }) => dispatch(loadUser(name)),
  },
  {
    path: '/eval',
    component: Eval,
  },
  {
    path: '/pricing',
    component: Pricing,
  },
]

import Home from 'components/Home'
import Race from 'components/Race'
import Pricing from 'components/Pricing'
import Challenges from 'components/Challenges'
import User from 'components/User'
import CreateText from 'components/CreateText'

import { loadRace } from 'actions/race'

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/new',
    exact: true,
    component: CreateText,
  },
  {
    path: '/r/:id',
    component: Race,
    load: ({ dispatch }) => dispatch(loadRace()),
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
    path: '/challenges',
    component: Challenges,
  },
]

import Home from 'components/Home'
import Race from 'components/Race'
import Pricing from 'components/Pricing'
import Challenges from 'components/Challenges'

import { loadRace } from 'actions/race'

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/race/:id',
    component: Race,
    load: ({ dispatch }) => dispatch(loadRace()),
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

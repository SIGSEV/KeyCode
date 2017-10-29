import Home from 'components/Home'
import Race from 'components/Race'
import Pricing from 'components/Pricing'
import Challenges from 'components/Challenges'

export default [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/race',
    component: Race,
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

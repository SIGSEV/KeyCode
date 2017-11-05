import q from 'q'
import Github from 'github'

// const orgs = [...Array(31)].map((_, i) => i * 5)
const orgIds = {
  5: 1810152,
  10: 1810158,
  15: 1810159,
  20: 1810160,
  25: 1810238,
  30: 1810239,
  35: 1810242,
  40: 1810243,
  45: 1810244,
  50: 1810245,
  55: 1810247,
  60: 1810250,
  65: 1810466,
  70: 1810468,
  75: 1810469,
  80: 1814543,
  85: 1814548,
  90: 1814551,
  95: 1814553,
  100: 1814555,
  105: 1814597,
  110: 1814598,
  115: 1814599,
  120: 1814600,
  125: 1814601,
  130: 1814602,
  135: 1814603,
  140: 1814605,
  145: 1814606,
  150: 1814608,
}

const github = new Github({ version: '3.0.0' })
github.authenticate({ type: 'token', token: process.env.GITHUB_TOKEN })

const removeUserFromOrg = user =>
  q
    .nfcall(github.orgs.removeMember, { org: `KeyCode-${user.currentOrg}`, user: user.name })
    .catch(() => null)

const addUserToOrg = async (user, org) => {
  if (org > 150) {
    throw new Error('Yes sure, not possible yet g0d/h4xxor')
  }

  const userGithub = new Github({ version: '3.0.0', debug: true })
  userGithub.authenticate({ type: 'oauth', token: user.token })

  user.currentOrg = org
  await user.save()

  await q.nfcall(github.orgs.addTeamMembership, { id: orgIds[org], user: user.name })
  await q.nfcall(userGithub.user.editOrganizationMembership, {
    org: `KeyCode-${org}`,
    state: 'active',
  })

  await q.nfcall(userGithub.orgs.publicizeMembership, { org: `KeyCode-${org}`, user: user.name })
}

export const hasStarredShit = async token => {
  const userGithub = new Github({ version: '3.0.0', debug: true })
  userGithub.authenticate({ type: 'oauth', token })

  try {
    await q.nfcall(userGithub.activity.checkStarringRepo, {
      owner: 'freeCodeCamp',
      repo: 'freeCodeCamp',
    })

    return true
  } catch (e) {
    return false
  }
}

export const updateUserRank = async (user, wpm) => {
  const org = Math.floor(wpm / 5) * 5

  if (org === 0 || !user.currentOrg || org === user.currentOrg) {
    return null
  }

  await removeUserFromOrg(user)
  await addUserToOrg(user, org)
}

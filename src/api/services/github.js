import q from 'q'
import Github from 'github'

// const orgs = [...Array(40)].map((_, i) => i * 5 + 5)
const teamIds = {
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
  155: 2548146,
  160: 2548147,
  165: 2548148,
  170: 2548149,
  175: 2548150,
  180: 2548151,
  185: 2548152,
  190: 2548154,
  195: 2548155,
  200: 2548156,
}

const github = new Github({ version: '3.0.0' })
github.authenticate({ type: 'token', token: process.env.GITHUB_TOKEN })

const removeUserFromOrg = user =>
  q
    .nfcall(github.orgs.removeMember, { org: `KeyCode-${user.currentOrg}`, username: user.name })
    .catch(() => null)

const addUserToOrg = async (user, org) => {
  if (org > 200) {
    throw new Error('Yes sure, not possible yet g0d/h4xxor')
  }

  const userGithub = new Github({ version: '3.0.0', debug: true })
  userGithub.authenticate({ type: 'oauth', token: user.token })

  user.currentOrg = org
  await user.save()

  await q.nfcall(github.orgs.addTeamMembership, { id: teamIds[org], username: user.name })
  await q.nfcall(userGithub.user.editOrganizationMembership, {
    org: `KeyCode-${org}`,
    state: 'active',
  })

  await q.nfcall(userGithub.orgs.publicizeMembership, {
    org: `KeyCode-${org}`,
    username: user.name,
  })
}

export const updateUserRank = async (user, score) => {
  const org = Math.floor(score / 5) * 5

  if (!org || org === user.currentOrg) {
    return null
  }

  if (user.currentOrg) {
    await removeUserFromOrg(user)
  }

  await addUserToOrg(user, org)
}

export const hasStarredShit = async token => {
  const userGithub = new Github({ version: '3.0.0' })
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

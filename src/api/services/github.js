import q from 'q'
import Github from 'github'

import teamIds from 'api/team-ids'

const github = new Github({ version: '3.0.0' })
github.authenticate({ type: 'token', token: process.env.GITHUB_TOKEN })

// const orgs = [...Array(40)].map((_, i) => i * 5 + 5)

// languages.forEach(lang => {
//   github.orgs.getTeams({ org: `KeyCode-${lang}` }, (err, res) => {
//     console.log(`${lang}: ${res.data[0].id},`)
//   })
// })

const removeUserFromOrg = user =>
  q
    .nfcall(github.orgs.removeMember, { org: `KeyCode-${user.currentOrg}`, username: user.name })
    .catch(() => null)

const addUserToOrg = async (user, org) => {
  if (org > 200) {
    throw new Error('Yes sure, not possible yet g0d/h4xxor')
  }

  const userGithub = new Github({ version: '3.0.0' })
  userGithub.authenticate({ type: 'oauth', token: user.token })

  user.currentOrg = org
  await user.save()

  await q.nfcall(github.orgs.addTeamMembership, { id: teamIds[org], username: user.name })
  await q.nfcall(userGithub.users.editOrgMembership, {
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

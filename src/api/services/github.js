import q from 'q'
import Github from 'github'

import { languages } from 'helpers/text'
import teamIds from 'api/team-ids'

const github = new Github({ version: '3.0.0' })
github.authenticate({ type: 'token', token: process.env.GITHUB_TOKEN })

/**
 * Get them
 */
export const getTeamMembers = org =>
  q.nfcall(github.orgs.getTeamMembers, { id: teamIds[org] }).then(res => res.data)

/**
 * Are you in booiiii?
 */
export const isUserInOrg = (username, org) =>
  q.nfcall(github.orgs.getOrgMembership, { org: `KeyCode-${org}`, username })

/**
 * Get the fuck out
 */
export const removeUserFromOrg = (username, org) =>
  q.nfcall(github.orgs.removeMember, { org: `KeyCode-${org}`, username }).catch(() => null)

/**
 * Real shit: add the team membership, accept the invite and publish org appartenance
 */
export const addUserToOrg = async (user, org) => {
  const userGithub = new Github({ version: '3.0.0' })
  userGithub.authenticate({ type: 'oauth', token: user.token })

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

/**
 * Self documenting function names are bad blablabla?? well fuck you.
 */
export const updateUserRank = async (user, score) => {
  const org = Math.floor(score / 5) * 5

  if (!org || org === user.currentOrg) {
    return null
  }

  if (user.currentOrg) {
    await removeUserFromOrg(user.name, user.currentOrg)
  }

  await addUserToOrg(user, org)

  user.currentOrg = org
  await user.save()
}

/**
 * Because that's a good thing to know
 */
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

/**
 * Utility function to print team ids for each of our orgs
 */
export const getTeams = () => {
  const orgs = [...Array(40)].map((_, i) => i * 5 + 5)

  languages.concat(orgs).forEach(suffix => {
    github.orgs.getTeams({ org: `KeyCode-${suffix}` }, (err, res) => {
      if (err) {
        return console.log(err) // eslint-disable-line
      }

      console.log(`${suffix}: ${res.data[0].id},`) // eslint-disable-line
    })
  })
}

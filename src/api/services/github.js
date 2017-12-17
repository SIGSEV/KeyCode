import q from 'q'
import Github from 'github'
import cache from 'memory-cache'

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
 * Get user orgs
 */
export const getOrgs = async name => {
  const cached = cache.get(`${name}-orgs`)
  if (cached) {
    return cached
  }

  const r = await fetch(`https://api.github.com/users/${name}/orgs`, {
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
  })

  const orgs = await r.json()

  if (orgs.message) {
    return []
  }

  const out = orgs
    .filter(o => o.login.startsWith('KeyCode-'))
    .map(({ login, avatar_url: avatar }) => {
      const suffix = login.replace('KeyCode-', '')
      const type = isNaN(suffix) ? 'leader' : 'score'

      return {
        login,
        avatar,
        placeholder: type === 'score' ? `Scored at least ${suffix}` : `${suffix} leader`,
      }
    })

  cache.put(`${name}-orgs`, out, 60e3 * 60)
  return out
}

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

  if (__PROD__) {
    await addUserToOrg(user, org)
  }

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
export const getTeams = async () => {
  const orgs = [...Array(20)].map((_, i) => 900 + i * 5 + 5)
  const ids = await Promise.all(
    languages.concat(orgs).map(suffix =>
      q
        .nfcall(github.orgs.getTeams, { org: `KeyCode-${suffix}` })
        .then(res => `${suffix}: ${res.data[0].id},`),
    ),
  )

  return ids
}

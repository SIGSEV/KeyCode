export function loadLeaders(language) {
  return {
    type: 'API:LOAD_LEADERS',
    payload: {
      url: '/leaderboard',
      query: {
        language,
      },
    },
  }
}

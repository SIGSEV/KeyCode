export function loadLeaders() {
  return {
    type: 'API:LOAD_LEADERS',
    payload: {
      url: '/leaderboard',
    },
  }
}

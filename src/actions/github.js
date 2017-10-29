export function search() {
  return {
    type: 'G:SEARCH',
    payload: {
      body: {
        query: `{
          viewer {
            login,
            avatarUrl
          }
        }`,
      },
    },
  }
}

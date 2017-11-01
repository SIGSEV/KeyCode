# KeyCode


### ROAD TO V1

#### little shit
- [ ] update link to source on Footer to real repo url

#### backend crap
- [ ] set up DB (SQL? mongo? dynamo?), with ability to use distant DB (nobody wants to shit up with local DB shit)
- [ ] implement authentication w github
  - [ ] Oauth
    - [ ] create user in DB. store the minimum amount of data, the rest will be fetched via graphql on request.
    - [ ] attach user to `req`
  - [ ] cookie, `me` reducer, use auth token in requests in api middleware
  - [ ] init user if exists when loading page
- [ ] forward the github search https://developer.github.com/v3/search/
    - [ ] `/search` endpoint, using user auth to query github
    - [ ] reduce result weight server-side

#### frontend junk
- [ ] make tests duration to be 60 seconds everytime. nobody wants to type an entire yarn.lock or something worst (will not develop). create a `Chronos` component to display the remaining time.
- [ ] find a good way to choose a test: user may want to search into their repos, maybe search in the trending repos? on the high starred repos? (on freecodecamp?). after that, they want to search for a file into that repo. so it will be like a multi step form. has to be easy and fast and able to pilot via keyboard (no shit).

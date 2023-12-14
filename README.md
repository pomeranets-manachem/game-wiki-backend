# Games Wiki backend

## About

    Game Wiki is a website where users can search for games and lookup its information. Registered users can create new games, and comment on them. 

## Info

This is the backend (ExpressJS API), which uses MongoDB and is hosted on adaptable.io
https://game-wiki-api.adaptable.app/

Frontend repo, made with ReactJS, using UIKit can be found here:
https://github.com/pomeranets-manachem/game-wiki-frontend

Demo:
https://ironhack-game-wiki.netlify.app/

## How to setup
`git clone`

`npm install`

`npm run dev`

You will need a .env file on the root directory with the variables:
- `TOKEN_SECRET` which us used for user authentication. Use a String, dont share it.
- `ORIGIN` which should point to the frontend, and its used for CORS.

You can use the signup page of the frontend to get user credentials or use the corresponding API endpoint `/auth/signup` with a utility of your choise (e.g. postman)
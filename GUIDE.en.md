# Step by step guide for building a project

This guide is a draft version of the Medium post:

https://medium.com/@wataruoguchi/how-to-create-a-ssr-serverless-app-with-firebase-nuxt-js-in-an-hour-6e6e03d0b3b8

### 1. Create a project dir

- $ mkdir <proj> && cd $_

### 2. Setup Nuxt.js

- $ sudo npm i -g vue-cli yarn
- $ vue init nuxt-community/starter-template src
- $ # vue init nuxt-community/typescript-template src (If you want to go with TypeScript)
  - ? Generate project in current directory? (Y/n) `Enter`
  - ? Project name `Enter`
  - ? Project description `Enter`
  - ? ? Author `Enter`
- $ cd src/ && yarn

### 3. Edit `src/pages/index.vue`

- We're in `src`
- $ yarn add isomorphic-fetch
- $ vi pages/index.vue
- Delete all default content
- It will be:
  ```
  <template>
    <ul>
      <li v-for="(fact, factIdx) in facts" :key="factIdx">
        {{ fact.text }}
      </li>
    </ul>
  </template>
  <script>
  import fetch from 'isomorphic-fetch'
  export default {
    async asyncData() {
      const response = await fetch('https://nuxt-ssr.firebaseio.com/facts.json')
      const facts = await response.json()
      return { facts }
    }
  }
  </script>
  ```

- $ yarn dev
- Open http://localhost:3000 to make sure the app can be running
- If you see 'View Page Source', you can tell it's SSR!

### 4. Use Babel to support old browsers

- We're in `src`
- $ vi package.json
- Add these in devDependencies
  ```
    "babel-plugin-module-resolver": "^2.7.1",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
  ```

- $ yarn
- $ vi nuxt.config.js
- add this under `build`
  ```
    publicPath: '/public/',
    vendor: ['isomorphic-fetch', 'babel-polyfill'],
    extractCSS: true,
    babel: {
      presets: [
        'es2015',
        'stage-0'
      ],
      plugins: [
        ['transform-runtime', {
          'polyfill': true,
          'regenerator': true,
        }]
      ],
    },
  ```
- $ yarn build
- It should be built without errors. yes! You can confirm it with `yarn dev` and visit http://localhost:3000 as well.
- Let's integrate with Firebase. In firebase, backend work will be done in functions directory. We're going to make it in a sec, but before that, let's change the buildDir.
- $ vi nuxt.config.js
- add this under root
  ```
  buildDir: '../functions/nuxt',
  ```
- Now, the build will look up packages in `functions` directory but it doesn't exist. Let's create with `firebase-tools`

### 5. Setup Firebase

- Move to <proj>
- $ sudo npm i -g firebase-tools
  - NOTE FOR THE FUTURE: In many cases, new features and bug fixes are available only with the latest version of the Firebase CLI and the firebase-functions SDK. It's a good practice to frequently update both the Firebase CLI and the SDK with these commands inside the functions folder of your Firebase project:
  ```
  npm install firebase-functions@latest firebase-admin@latest --save
  npm install -g firebase-tools
  ```
- $ firebase login
- $ firebase init functions
  - ? Select a default Firebase project for this directory: `Pick one from these:`
  ```
  ? Select a default Firebase project for this directory:
    [don't setup a default project]
  ❯ civic-tech-vancouver (civic-tech-vancouver)
    [create a new project]
  ```
  - ? What language would you like to use to write Cloud Functions? JavaScript - `Enter`
  - ? Do you want to use ESLint to catch probable bugs and enforce style? `Enter`
  - ? Do you want to install dependencies with npm now? `Enter`
- Visit https://console.firebase.google.com
- $ firebase use --add
- Aliasing with 'prod' in my case

### 6. Setup functions

- Remember, we had build errors because the build is looking at `functions/package.json`
- We're in <proj>
- $ cd functions
- $ vi package.json
- add `"engines": { "node": "8" }` to use node8 in Cloud Function
- copy all dependencies from `src/package.json` and paste. Make sure nothing is duplicated. Then close the file. TODO(rm package-lock.json)
- $ yarn
- $ yarn add express
- $ cd ../src/ && yarn build
- $ cd ../functions/
- You can see `nuxt` directory in `functions` directory
- $ vi index.js
- Clear all, then create an express app.
  ```
  const functions = require('firebase-functions')
  const express = require('express')
  const { Nuxt } = require('nuxt')

  const app = express()

  const config = {
    dev: false,
    buildDir: 'nuxt',
    build: {
      publicPath: '/public/'
    }
  }
  const nuxt = new Nuxt(config)

  function handleRequest(req, res) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200')
    nuxt.renderRoute('/').then(result => {
      res.send(result.html)
    }).catch(e => {
      res.send(e)
    })
  }
  app.get('*', handleRequest)
  exports.nuxtApp = functions.https.onRequest(app)
  ```
- Let's go back to <prod>

### 7. Setup static assets

- We're in <proj>
- $ firebase init hosting
  - ? What do you want to use as your public directory? public
  - ? Configure as a single-page app (rewrite all urls to /index.html)? (y/N) N
- $ rm public/404.html public/index.html
- $ cp -R functions/nuxt/dist public/assets

### 8. Try running

- We're in <prod>
- $ vi firebase.json
- Edit `rewrites` under `hosting` like this:
  ```
  "rewrites": [
    {
      "source": "**",
      "function": "nuxtApp"
    }
  ]
  ```

- $ sudo firebase serve --only functons,hosting
- Open http://localhost
- You may see errors in Console tab (Uncaught SyntaxError)
- $ vi src/nuxt.config.js
- Change publicPath from `/public/` to `/`
- $ vi functions/index.js
- Change publicPath from `/public/` to `/`
- $ cd src && yarn build
- Build will have no errors
- $ cd .. && cp -R functions/nuxt/dist/ public
- $ cp -R src/static/* public
- $ sudo firebase serve --only hosting,functions
- $ firebase deploy
- Wait until URL appears. Go to the URL in your browser. Your web app should be deployed!

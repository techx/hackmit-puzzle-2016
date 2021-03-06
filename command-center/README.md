# Command Center App

### Dependencies
- **Node.js** [Installation](https://nodejs.org/download/)
- **MongoDB** [Installation](http://docs.mongodb.org/manual/installation/) You need to have the Mongo daemon running (just run `mongod`)

### Running Locally
- Run `npm install` to get all the node modules you need installed locally.
- Run `npm run dev` to run the server with nodemon on port 3000.
- Run `npm start` to start the server. It should be running at `localhost:3000`.

### Adding Modules
- Run `npm install $PACKAGE_NAME --save`. The save flag adds the package to the `package.json` file. 
- Then stage and commit `package.json`.

### Usage
- Go to /admin/users to see a view of users and time completed

### Environment Variables

```
NODE_ENV='production'
GITHUB_CLIENT_ID='xxx'
GITHUB_CLIENT_SECRET='xxx'
PUBLIC_HOST_URL='xxx'
COMMAND_CENTER_SESSION_SECRET='xxx'
```

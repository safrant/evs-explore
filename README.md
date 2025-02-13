# evs-explore

EVS terminology browser application

## NPM Best Practices

See https://blog.risingstack.com/nodejs-at-scale-npm-best-practices/

* Run "npm outdated" from frontend to see whether versions are out of date
  * Some fixing of packages was done, but this is really finicky.
  * Sticking with Angular 8 for now.

### Building the Java Webapp

This is how things run in production.

Run `./gradlew clean build"` from the "web" folder.

### Deploying to AWS servers

The built application has an application.yml file that drives the proxy endpoint for the redirected
calls to the teh API.  Make sure this environment variable is set correctly for the deployment env.


### Launching EVS-EXPLORE for development

Install npm, ideally the version specified in package.json

There are three ways to launch EVS-EXPLORE for development:

* If running a http://localhost:8082 EVSRESTAPI, use `npm start` from `web/frontend`
* To use the NCI dev deployment of EVSRESTAPI, use `npm run start:dev` from `web/frontend`
* To simulate the production environment, perform the gradle build and then launch
  the .war file.  For example:

```bash
cd web
java -Xmx4096M -jar build/libs/evsexplore-*.war
```

### Supported Browsers
The application has been specifically tested on the following browsers:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Opera

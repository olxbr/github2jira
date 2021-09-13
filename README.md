# github2jira

Application [Node.js + Typescript] to support Github issues to Jira.

## ATTENTION PLEASE!!!

This is not a pet project and it was my first node/typescritp adventure! So, feel free to share some feedbacks and also improve this thing.

## What the application does and doesn’t:

- [x]  Get Github issues
    - [x]  Optionally filtered by date (not a range)
    - [x]  Optionally filtered by state (open or closed)
    - [ ]  Optionally filtered by date range

- [x]  Process Github's data into JIRA's data
    - [x]  Github's Bug label turn into a Bug issue on Jira
    - [X]  Github's issues parenthood/relationship created on Jira
        - [X]  Epic
    - [x]  User Mapping from github to Jira
        - [x]  Assignee property
        - [x]  Reporter property
    - [x]  Github labels
    - [x]  Date/Status information
        - [x]  Created at
        - [x]  Resolved at
        - [x]  Closed or Open
        - [X]  Board current status 

- [x]  Export data
    - [x]  JSON
    - [ ]  CSV

- [ ]  Migrate data to Jira (NOTE: Sadly this feature was note possible due JIRA's API limitations.) 

## Installation

 1. Cloning the project: 

- Using SSH

  ```bash
  $ git clone git@github.com:olxbr/github2jira.git <directory> 
  $ cd <directory>
  ```

- Using HTTPS

  ```bash
  $ git clone https://github.com/olxbr/github2jira.git <directory>
  $ cd <directory>
  ```

1. Install [npm](http://npmjs.org/) 
  ```bash
  $ npm install
  ```
## Dependences 
- Dev:
    - [ts-node-dev 1.1.8](https://www.npmjs.com/package/ts-node-dev)
    - [typescript 4.3.5](https://www.npmjs.com/package/typescript)
    
- Others:
    - [@octokit 3.5.1](https://www.npmjs.com/package/@octokit/core)
    - [body-parser 1.19.0](https://www.npmjs.com/package/body-parser)
    - [express 4.17.1](https://www.npmjs.com/package/express)
    - [jira-connector 3.1.0](https://www.npmjs.com/package/jira-connector)
    - [axios 0.21.4](https://www.npmjs.com/package/axios)
    - [axios-rate-limit 1.3.0](https://www.npmjs.com/package/axios-rate-limit)
    - [md-to-adf 0.6.4](https://www.npmjs.com/package/md-to-adf)

## How to use

1. Starting it 
  ```bash
  npm run dev
  ```
2. Just use it. [DOCUMENTATION](https://documenter.getpostman.com/view/797179/Tzz7Mcq9) 
3. Create a Jira API TOKEN [JIRA](https://id.atlassian.com/manage-profile/security/api-tokens) 
4. Create a Github API TOKEN [GITHUB](https://github.com/settings/tokens) 
    a. Important to check all REPO, ADMIN:ORG and USER premissions. And also Read permissions for ADMIN:REPO_HOOK and ADMIN:PUBLIC_KEY.

### POST Migrate

Main method that should migrate the data. But due JIRA's API limitations for the migration process, this method just return the data to use with [JIRA's Migration "Wizard"](https://olxbr.atlassian.net/secure/CsvSetupPage!default.jspa?externalSystem=com.atlassian.jira.plugins.jim-plugin%3AcsvImporter&nonImporter=noneOfThese&onboarding=true). 

1. Prepare body-request 
2. Use POST Migrate
3. Copy JSON Response
4. Convert to CSV ([possible converter to use](http://convertcsv.com/json-to-csv.htm))
5. Use [JIRA's Migration "Wizard"](https://olxbr.atlassian.net/secure/CsvSetupPage!default.jspa?externalSystem=com.atlassian.jira.plugins.jim-plugin%3AcsvImporter&nonImporter=noneOfThese&onboarding=true)
    1. File import
        1. Upload CSV file
    2. Setup
        1. Select the JIRA's project to import 
        2. Set date format to `yyyy-MM-dd'T'HH:mm:ss'Z'`
    3. Fields 
        1. Map desired fields (attention to duplicated fields in Custom Fields)
        2. Summary field is mandatory to start the import process.

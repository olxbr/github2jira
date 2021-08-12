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
    - [ ]  Github's issues parenthood/relationship created on Jira
        - [ ]  Epic
        - [ ]  Subtask
    - [x]  User Mapping from github to Jira
        - [x]  Assignee property
        - [x]  Reporter property
    - [x]  Github labels
    - [x]  Date/Status information
        - [x]  Created at
        - [x]  Resolved at
        - [x]  Closed or Open
        - [ ]  Board current status

- [x]  Export data
    - [x]  JSON
    - [ ]  CSV

- [ ]  Migrate data to Jira (NOTE: Sadly this feature was note possible due JIRA's API limitations.) 

- [ ]  Sincronize Jira's issues with Github updates (current status)
    - [ ]  passively
    - [ ]  actively

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

## How to use

1. Starting it 
  ```bash
  npm run dev
  ```

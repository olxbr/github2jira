# github2jira

Application [Node.js + Typescript] to support Github issues to Jira.

### What the application does and doesn’t:
---

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

### Installation
---

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

### How to use
---

1. Starting it 
  ```bash
  npm run dev
  ```

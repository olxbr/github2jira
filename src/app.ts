import bodyParser from 'body-parser';
import express from 'express';
import { constants } from "./constants";
import { Github } from './github';
import { Jira } from "./jira";
import { Router } from "./router";

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
// main method 
app.post(constants.MIGRATE_POST_PATH, Router.migrationJSONHandler);

// Github support methods
app.get(constants.MIGRATE_GITHUB_GET_ISSUES_PATH, Github.getAllIssuesHandler);

// Jira support methods
app.put(constants.MIGRATE_JIRA_BULK_UPDATE_PATH, Jira.bulkUpdateHandler);
app.get(constants.MIGRATE_JIRA_GET_ISSUE_DETAIL_PATH, Jira.getIssueDetailHandler);

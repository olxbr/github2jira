import type { MigrateRequest } from "./types";
import { constants } from "./constants";
import express from 'express';
import bodyParser from 'body-parser';
import { Github } from './github';
import { Jira } from "./jira";

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
// main method 
app.post(constants.MIGRATE_POST_PATH, async (request: MigrateRequest, response: any) => {
    Github.getAllIssuesHandler(request, response);
});

// Github support methods
app.get(constants.MIGRATE_GITHUB_GET_ISSUES_PATH, Github.getAllIssuesHandler);
// app.get(projects)

// Jira support methods
app.post(constants.MIGRATE_JIRA_BULK_CREATE_PATH, Jira.bulkCreateHandler)
app.get(constants.MIGRATE_JIRA_GET_ISSUE_DETAIL_PATH, Jira.getIssueDetailHandler);

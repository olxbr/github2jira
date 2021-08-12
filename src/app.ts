import type { MigrateRequest } from "./types";
import { constants } from "./constants";
import express from 'express';
import bodyParser from 'body-parser';
import { Github } from './github';
import { Jira } from "./jira";
import { DataTransformer } from "./dataTransformer";

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
// main method 
app.post(constants.MIGRATE_POST_PATH, async (request: MigrateRequest, response: any) => {
    await Github.getAllGithubIssuesFrom(
        request.body.github.organization_name, 
        request.body.github.repo_name, 
        request.body.github.auth, 
        request.body.since
    ).then(result => {
        const jiraIssues = DataTransformer.githubIssuesToJSON(result, request.body);
        response.status(200).json(jiraIssues); 
    }).catch(err => {
        response.status(err.response.status).json({ message: err.response.data.message});
    });
});

// Github support methods
app.get(constants.MIGRATE_GITHUB_GET_ISSUES_PATH, Github.getAllIssuesHandler);

// Jira support methods
// app.post(constants.MIGRATE_JIRA_BULK_CREATE_PATH, Jira.bulkCreateHandler)
app.get(constants.MIGRATE_JIRA_GET_ISSUE_DETAIL_PATH, Jira.getIssueDetailHandler);

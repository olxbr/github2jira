import type { MigrateRequest } from "./types";
import { constants } from "./constants";
import express from 'express';
import bodyParser from 'body-parser';
import { Github } from './github';

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
// main method 
app.post(constants.MIGRATE_POST_PATH, async (request: MigrateRequest, response: any) => {
    Github.githubIssuesHandler(request, response);
});

// Github support methods
app.get(constants.MIGRATE_GITHUB_GET_ISSUES_PATH, Github.githubIssuesHandler);

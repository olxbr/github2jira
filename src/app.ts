import type { MigrateRequest } from "./types";
import { constants } from "./constants";
import express from 'express';
import bodyParser from 'body-parser';
import { Github } from './github';

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
app.post(constants.MIGRATE_POST_PATH, async (request: MigrateRequest, response: any) => {
    await Github.getAllGithubIssuesFrom(
        request.body.github.organization_name, 
        request.body.github.repo_name, 
        request.body.github.auth, 
        request.body.since
    ).then(result => {
        response.status(200).json({ message: result}); 
    }).catch(err => {
        response.status(err.response.status).json({ message: err.response.data.message});
    });
});

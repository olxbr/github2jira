import { Octokit } from "@octokit/core";
import express from 'express';
import bodyParser from 'body-parser';
import type { MigrateRequest } from "./types";

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
app.post('/migrate', async (request: MigrateRequest, response) => {
    await getGithubIssuesFrom(
        request.body.github.organization_name, 
        request.body.github.repo_name, 
        request.body.github.auth
    ).then(result => {
        response.status(200).json({ message: result}); 
    }).catch(err => {
        response.status(err.response.status).json({ message: err.response.data.message});
    });
});

async function getGithubIssuesFrom(ownerName: string, repoName: string, githubAuth: string): Promise<JSON> {
    const octokit = new Octokit({ auth: githubAuth});

    const response = await octokit.request("GET /repos/{owner}/{repo}/issues?state={issueState}&per_page={itemsPerPage}&page={pageIndex}", {
        owner: ownerName,
        repo: repoName,
        issueState: "all",
        itemsPerPage: "100",
        pageIndex: "0"
    }).catch(err => {
        throw err;
    });

    return response.data;
}


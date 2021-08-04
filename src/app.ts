import { Octokit } from "@octokit/core";
import express from 'express';
import bodyParser from 'body-parser';
import type { MigrateRequest } from "./types";
import { constants } from "./constants";

const app = express();
app.use(bodyParser.json());
app.listen(3000);
 
app.post(constants.MIGRATE_POST_PATH, async (request: MigrateRequest, response: any) => {
    await getAllGithubIssuesFrom(
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

async function getAllGithubIssuesFrom(ownerName: string, repoName: string, githubAuth: string, since: string | void): Promise<JSON> {
    const octokit = new Octokit({ auth: githubAuth});

    let response = null, page = 1, result = null, path = constants.GITHUB_GET_REPO_ISSUES_PATH;
    if (since) {
        path += ("&since=" + since);
    }

    do {
        response = await octokit.request(path, {
            owner: ownerName,
            repo: repoName,
            issueState: constants.GITHUB_REPO_ISSUES_PARAMS_ISSUE_STATE,
            itemsPerPage: constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE,
            pageIndex: String(page)
        }).catch(err => {
            throw err;
        });

        if (result) {
            result = result.concat(response.data);
        } else {
            result = response.data;
        }
        page++;
    } while ((response.data as Array<JSON>).length == Number(constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE));

    return removePullRequests(result);
}

function removePullRequests(githubResult: Array<any>): any {
    return githubResult.map(issue => {
        if (!issue.pull_request) {
            return issue;
        }
    });
}

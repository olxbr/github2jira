import { Octokit } from "@octokit/core";
import { constants } from "./constants";
import { MigrateRequest } from "./types";

export module Github {
    export async function getAllIssuesHandler(request: MigrateRequest, response: any) {
        await getAllGithubIssuesFrom(
            request.body.github.organization_name, 
            request.body.github.repo_name, 
            request.body.github.auth, 
            request.body.github.since, 
            request.body.github.state
        ).then(result => {
            response.status(200).json({ message: result}); 
        }).catch(err => {
            response.status(err.response.status).json({ message: err.response.data.message});
        });
    }

    export async function getAllGithubIssuesFrom(ownerName: string, repoName: string, githubAuth: string, since: string | void, issueState: string | void): Promise<JSON> {
        const octokit = new Octokit({ auth: githubAuth});
    
        let response = null, page = 1, result = null, path = constants.GITHUB_GET_REPO_ISSUES_PATH, state = issueState ? issueState : "all";
        if (since) {
            path += ("&since=" + since);
        }
    
        do {
            response = await octokit.request(path, {
                owner: ownerName,
                repo: repoName,
                issueState: state,
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
        return githubResult.filter(issue => !issue.pull_request);
    }
}
import { Octokit } from "@octokit/core";
import { constants } from "./constants";
import { MigrateRequest } from "./types";
import { MigrateMapping } from "./types";

export module Github {
    export async function getAllIssuesHandler(request: MigrateRequest, response: any) {
        await getAllGithubIssuesWith(
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

    export async function getAllGithubIssuesWith(ownerName: string, repoName: string, githubAuth: string, since: string | void, issueState: string | void): Promise<JSON> {
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

    export async function getAllGithubBoardsHandler(request: MigrateRequest, response: any) {
        await getAllGithubBoardsWith(
            request.body.github.organization_name, 
            request.body.github.repo_name, 
            request.body.github.auth
        ).then(result => {
            response.status(200).json({ message: result}); 
        }).catch(err => {
            response.status(err.response.status).json({ message: err.response.data.message});
        });
    }

    export async function getAllGithubBoardsWith(ownerName: string, repoName: string, githubAuth: string): Promise<any> {
        const octokit = new Octokit({ auth: githubAuth});
        
        let response = null, page = 1, path = constants.GITHUB_REPO_BOARD_PATH;
        
        do {
            response = await octokit.request(path, {
                owner: ownerName,
                repo: repoName,
                itemsPerPage: constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE,
                pageIndex: String(page),
                mediaType: {
                  previews: [
                    'inertia'
                  ]
                }
            }).catch(err => {
                console.log(err);
                throw err;
            });
        } while ((response.data as Array<JSON>).length == Number(constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE));

        return response.data;
    }

    // export async function getGithubBoardColumnsHandler(request: MigrateRequest, response: any) {
    //     await getGithubBoardColumnsWith(
    //         request.body.github.boards[0].board_id,
    //         request.body.github.auth
    //     ).then(result => {
    //         response.status(200).json({ message: result}); 
    //     }).catch(err => {
    //         response.status(err.response.status).json({ message: err.response.data.message});
    //     });
    // }

    export async function getGithubBoardColumnsWith(boardId: string, githubAuth: string): Promise<JSON> {
        const octokit = new Octokit({ auth: githubAuth});
        
        let response = null, page = 1, path = constants.GITHUB_REPO_BOARD_COLUMNS_PATH;
        
        do {
            response = await octokit.request(path, {
                board_id: boardId,
                itemsPerPage: constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE,
                pageIndex: String(page),
                mediaType: {
                  previews: [
                    'inertia'
                  ]
                }
            }).catch(err => {
                console.log(err);
                throw err;
            });
        } while ((response.data as Array<JSON>).length == Number(constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE));

        return response.data;
    }

    // export async function getGithubColumnsCardsHandler(request: MigrateRequest, response: any) {
    //     await getGithubBoardColumnsCardsWith(
    //         request.body.github.boards[0].column_mapping,
    //         request.body.github.auth
    //     ).then(result => {
    //         response.status(200).json({ message: result}); 
    //     }).catch(err => {
    //         response.status(err.response.status).json({ message: err.response.data.message});
    //     });
    // }

    export async function getGithubBoardColumnCardsWith(columnId: string, githubAuth: string): Promise<any> {
        const octokit = new Octokit({ auth: githubAuth});
        
        let response = null, result = null, page = 1, path = constants.GITHUB_COLUMNS_CARD_PATH;
        
        do {
            response = await octokit.request(path, {
                column_id: columnId,
                itemsPerPage: constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE,
                pageIndex: String(page),
                mediaType: {
                  previews: [
                    'inertia'
                  ]
                }
            }).catch(err => {
                console.log(err);
                throw err;
            });

            if (result) {
                result = result.concat(response.data);
            } else {
                result = response.data;
            }

            page++;
        } while ((response.data as Array<JSON>).length == Number(constants.GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE));

        return result;
    }
    
    function removePullRequests(githubResult: Array<any>): any {
        return githubResult.filter(issue => !issue.pull_request);
    }
}
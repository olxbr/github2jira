import { MigrateRequest, MigrateMapping } from "./types";
import { Github } from "./github";
import { Jira } from "./jira";
import { DataTransformer } from "./dataTransformer";

export module Router {
    async function migrationWithoutStatusJSONHandler(request: MigrateRequest, response: any) {
        await Github.getAllGithubIssuesWith(
            request.body.github.organization_name, 
            request.body.github.repo_name, 
            request.body.github.auth, 
            request.body.github.since, 
            request.body.github.state
        ).then(result => {
            let jiraIssues = DataTransformer.githubIssuesToJSON(result, request.body, null);
            response.status(200).json(jiraIssues); 
        }).catch(err => {
            response.status(err.response.status).json({ message: err.response.data.message});
        });
    }

    export async function migrationJSONHandler(request: MigrateRequest, response: any) {
        if (!request.body.status_mapping) {
            migrationWithoutStatusJSONHandler(request, response);
        }
        
        Promise.all(
            request.body.status_mapping.map( async (column: MigrateMapping) => {
                let githubColumnCards = await Github.getGithubBoardColumnCardsWith(column.github, request.body.github.auth);
            
                let githubColumnIssues = githubColumnCards.map(card => {
                    return card.content_url ? card.content_url.split("/").pop() : ""
                });
                
                return {
                    column_name: column.jira,
                    issues: githubColumnIssues
                };
            })
        ).then(async githubColumnsIssues => {
            let githubIssues = await Github.getAllGithubIssuesWith(
                request.body.github.organization_name, 
                request.body.github.repo_name, 
                request.body.github.auth, 
                request.body.github.since, 
                request.body.github.state
            ).then(githubIssues => {
                let jiraLikeIssues = DataTransformer.githubIssuesToJSON(githubIssues, request.body, githubColumnsIssues);
                response.status(200).json(jiraLikeIssues);
            }).catch(err => {
                response.status(err.response.status).json({ message: err.response.data.message});
            });
        });
    }

    export async function updateJiraIssuesDescriptionsHandler(request: MigrateRequest, response: any) {
        let jiraIssues = await Jira.getAllIssuesFrom(
            request.body.jira.user_email,
            request.body.jira.user_api_token,
            request.body.jira.project_key
        ).then((issues: any) => {
            response.status(200).json(issues);
        }).catch(err => {
            response.status(err.statusCode).json({message: err.body});
        })
    }
}
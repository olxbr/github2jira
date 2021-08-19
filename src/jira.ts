import { constants } from "./constants";
import { MigrateRequest } from "./types";
import JiraClient from "jira-connector";

export module Jira {
    export async function bulkCreateHandler(request: MigrateRequest, response: any) {
        await createJIRAIssues(request.body.jira.user_email, request.body.jira.user_api_token, request.body.jira.project_key).then(result => {
            let url = "https://" + constants.JIRA_HOST + constants.JIRA_ALL_ISSUES_PART_I + request.body.jira.project_key + constants.JIRA_ALL_ISSUES_PART_II
            response.status(200).json({
                message: "Yeah! Look on " + url
            });
        }).catch(err => {
            response.status(err.statusCode).json({message: err.body});
        });
    }

    export async function getIssueDetailHandler(request: MigrateRequest, response: any) {
        await getIssueDetail(request.body.jira.user_email, request.body.jira.user_api_token, request.body.jira.issue_key).then(result => {
            response.status(200).json({message: result});
        }).catch(err => {
            console.log(err);
            response.status(err.statusCode).json({message: err.body});
        })
    }

    async function createJIRAIssues(userEmail: string, apiToken: string, projectKey: string): Promise<any> {
    const jiraClient = new JiraClient({
        host: constants.JIRA_HOST,
            basic_auth: {
                email: userEmail,
                api_token: apiToken
            }
        });
        await jiraClient.issue.bulkCreate({
            "issueUpdates": [
                {
                    fields: {
                        project: {
                            key: projectKey,
                        },
                        summary: "TEST API PACHECO 01",
                        issuetype: {
                            name: "Story",
                        },
                        assignee: {
                            id: "60b570a424eedc006d0ff236"
                        },
                        labels: [
                            "teste"
                        ],
                        reporter: {
                            id: "70121:15a15700-d862-42ab-81cd-dbb43e82f879" 
                        }
                    },
                    status: {
                        name: "Done",
                    },
                    created: "2020-10-09T14:20:46.000-0300",
                    resolved: "2020-10-09T19:00:16.000-0300",
                }
            ]
        }).then(issues => {
            return JSON.parse(issues);
        }).catch(err => {
            throw JSON.parse(err);
        });
    }

    async function getIssueDetail(userEmail: string, apiToken: string, issueKey: string) {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
            basic_auth: {
                email: userEmail,
                api_token: apiToken
            }
        });

        await jiraClient.issue.getIssue({
            issueKey: issueKey,
        }).then(issue => {
            console.log(issue);
            return;
        }).catch(err => {
            throw JSON.parse(err);
        });
    }
}
import { constants } from "./constants";
import { MigrateRequest } from "./types";
import JiraClient from "jira-connector";

export module Jira {
    export async function bulkCreateHandler(request: MigrateRequest, response: any) {
        await createJIRAIssues().then(result => {
            const url = "https://" + constants.JIRA_HOST + constants.JIRA_ALL_ISSUES_PART_I + "REN" + constants.JIRA_ALL_ISSUES_PART_II
            response.status(200).json({
                message: "Yeah! Look on " + url
            });
        }).catch(err => {
            response.status(err.statusCode).json({message: err.body});
        });
    }

    export async function getIssueDetailHandler(request: MigrateRequest, response: any) {
        await getIssueDetail().then(result => {
            response.status(200).json({message: result});
        }).catch(err => {
            response.status(err.statusCode).json({message: err.body});
        })
    }

    async function createJIRAIssues(): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
            basic_auth: {
                email: "user_email",
                api_token: "JIRA_API_TOKEN"
            }
        });
        await jiraClient.issue.bulkCreate({
            "issueUpdates": [
                {
                    fields: {
                        project: {
                            key: "REN",
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

    async function getIssueDetail() {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
            basic_auth: {
                email: "user_email",
                api_token: "JIRA_API_TOKEN"
            }
        });

        await jiraClient.issue.getIssue({
            issueKey: "TOW-50",
        }).then(issue => {
            console.log(issue);
            return;
        }).catch(err => {
            throw JSON.parse(err);
        });
    }
}
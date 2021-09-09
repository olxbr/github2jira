import { constants } from "./constants";
import { MigrateRequest } from "./types";
import JiraClient from "jira-connector";
import Axios from "axios";

export module Jira {
    export async function getIssueDetailHandler(request: MigrateRequest, response: any) {
        await getIssueDetail(
            request.body.jira.user_email,
            request.body.jira.user_api_token, 
            request.body.jira.issue_key
        ).then(result => {
            response.status(200).json({message: result});
        }).catch(err => {
            response.status(err.statusCode).json({message: err.body});
        });
    }

    export async function getAllIssuesFrom(userEmail: string, apiToken: string, projectKey: string): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
                basic_auth: {
                    email: userEmail,
                    api_token: apiToken
                },
                version: 3
        });

        let response = null, result = null, page = 0, range = Number(constants.ISSUES_PARAMS_ITEMS_PER_PAGE);
        
        do {
            response = await jiraClient.search.search({
                method: "POST",
                jql: "project = " + projectKey + " ORDER BY created ASC",
                maxResults: range,
                startAt: page,
                fields: [
                    "summary",
                    "description",
                    "customfield_10154" //Github Issue
                ]
            }).catch(err => {
                throw JSON.parse(err);
            });

            if (result) {
                result = result.concat(response.issues);
            } else {
                result = response.issues;
            }
            page = page + range;
        } while (response.issues.length == Number(constants.ISSUES_PARAMS_ITEMS_PER_PAGE));
        return result;
    }

    export async function updateIssuesWith(jiraIssues: Array<any>, userEmail: string, apiToken: string, projectKey: string): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
                basic_auth: {
                    email: userEmail,
                    api_token: apiToken
                },
                version: 3
        });

        let newJiraIssues = Promise.all(jiraIssues.map(async jiraIssue => {
            if (typeof jiraIssue.fields?.description === 'string') {
                return;
            }
            
            await Axios({
                method: "put",
                url: jiraClient.buildURL("/issue/" + jiraIssue.key + "?notifyUsers=false", 3),
                auth: {
                    username: userEmail,
                    password: apiToken
                },
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json" 
                },
                data: {
                    key: jiraIssue.key,
                    fields: {
                        description: jiraIssue?.fields?.description 
                    },
                    properties: []
                }
            }).catch(err => {
                throw {
                    statusCode: err.response.status,
                    message: "Something went wrong with " + jiraIssue.key 
                };
            });

            return jiraIssue.key;
        }));
        
        return {
            updatedIssues: (await newJiraIssues)
        };
    }

    export async function linkingParentsAndChildrensWithfunction(jiraIssues: Array<any>, userEmail: string, apiToken: string, projectKey: string): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
                basic_auth: {
                    email: userEmail,
                    api_token: apiToken
                },
                version: 3
        });

        let teste = [jiraIssues[500]];
        console.log(teste)
        let newJiraIssues = Promise.all(teste.map(async jiraIssue => {
            await Axios({
                method: "post",
                url: jiraClient.buildURL("/issueLink", 2),
                auth: {
                    username: userEmail,
                    password: apiToken
                },
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json" 
                },
                data: {
                    type: { name: "Parent" },
                    outwartdIssue: { key: jiraIssue.parent_key },
                    inwardIssue: { key: jiraIssue.key }
                }
            }).catch(err => {
                throw {
                    statusCode: err.response.status,
                    message: "Something went wrong with " + jiraIssue.key 
                };
            });

            return jiraIssue.key;
        }));
        
        return {
            updatedIssues: (await newJiraIssues)
        };
    }

    async function getIssueDetail(userEmail: string, apiToken: string, issueKey: string): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
            basic_auth: {
                email: userEmail,
                api_token: apiToken
            }
        });

        let result = await jiraClient.issue.getIssue({
            issueKey: issueKey,
        }).catch(err => {
            throw JSON.parse(err);
        });

        return result;
    }
}
import { constants } from "./constants";
import { MigrateRequest } from "./types";
import JiraClient from "jira-connector";
import Axios from "axios";
import rateLimit from 'axios-rate-limit';
import axios from "axios";

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

    export async function updateIssuesWith(jiraIssues: Array<any>, userEmail: string, apiToken: string): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
                basic_auth: {
                    email: userEmail,
                    api_token: apiToken
                },
                version: 3
        });
        let client = rateLimit(axios.create(), { maxRPS: 3 });

        let bodyResponse = {
            total_issues: jiraIssues.length,  
            not_updated: {
                reason: "Something goes wrong!",
                total: 0,
                issues: []
            },
            updated: {
                total: 0,
                issues: []
            }
        }

        await Promise.all(jiraIssues.map(async jiraIssue => {
            if (typeof jiraIssue.fields?.description === 'string' || typeof jiraIssue.key != 'string') {
                console.log("######## FALL START");
                console.log(jiraIssue);
                console.log("######## FALL END");
                return;
            }
            
            await client.request({
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
            }).then(result => {
                bodyResponse.updated.issues.push(jiraIssue.key);
                console.log("######## SUCCESS")
            }).catch(err => {
                console.log("######## CATCH START");
                if (err?.response?.status != 400) {
                    console.log(jiraIssue);
                    console.log(err?.response);
                    // throw {
                    //     statusCode: err.response.status,
                    //     message: "Something went wrong with " + jiraIssue.key 
                    // };
                }   
                bodyResponse.not_updated.issues.push({
                    statusCode: err?.response?.status,
                    key: jiraIssue.key
                });
                console.log("######## CATCH END");
                return;
            });
            return jiraIssue.key;
        }));

        bodyResponse.not_updated.total = bodyResponse.not_updated.issues.length;
        bodyResponse.updated.total = bodyResponse.updated.issues.length;
        return bodyResponse;
    }

    export async function linkingParentsAndChildrensWithfunction(jiraIssues: Array<any>, userEmail: string, apiToken: string): Promise<any> {
        const jiraClient = new JiraClient({
            host: constants.JIRA_HOST,
                basic_auth: {
                    email: userEmail,
                    api_token: apiToken
                },
                version: 3
        });
        let client = rateLimit(axios.create(), { maxRPS: 3 });

        let bodyResponse = {
            total_issues: jiraIssues.length,  
            not_updated: {
                reason: "Reference is not an epic!",
                total: 0,
                not_an_epic: [],
                issues: []
            },
            updated: {
                total: 0,
                issues: []
            }
        }

        await Promise.all(jiraIssues.map(async jiraIssue => {
            await client.request({
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
                        customfield_10014: jiraIssue.parent_key 
                    },
                    properties: []
                }
            }).then(result => {
                bodyResponse.updated.issues.push(jiraIssue.key);
            }).catch(err => {
                if (err?.response?.status != 400) {
                    throw {
                        statusCode: err.response.status,
                        message: "Something went wrong with " + jiraIssue.key 
                    };
                }   
                bodyResponse.not_updated.issues.push(jiraIssue.key);
                bodyResponse.not_updated.not_an_epic.push(jiraIssue.parent_key);
                return;
            });
            return jiraIssue.key;
        }));

        bodyResponse.not_updated.total = bodyResponse.not_updated.issues.length;
        bodyResponse.updated.total = bodyResponse.updated.issues.length;
        return bodyResponse;
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
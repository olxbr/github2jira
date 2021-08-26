import type { MigrateBody } from "./types";
import mdTranslator from 'md-to-adf';

export module DataTransformer {
    export function githubIssuesToJSON(githubIssues: any, migrateBody: MigrateBody, githubColumnsIssues: any): any {
        return githubIssues.map((issue: any) => {
            let labelsObjects = (issue.labels as Array<any>)
            var labels = labelsObjects.map((label: any) => {
                return label.name;
            });
            
            let issueType = getIssueType(labels, migrateBody.github.bug_tag, migrateBody.github.epic_tag);
            var priority = ""
            if (issueType == "Bug" && migrateBody.github.priorities) {
                priority = getBugPriority(labels, migrateBody.github.priorities);
            }

            labels = labels.concat(getLabelsFromTitle(issue.title));

            var reporter = null;
            var assignee = null;

            if (migrateBody.user_mapping) {
                reporter = migrateBody.user_mapping.find((user: any) => {
                    return user.github == issue.user.login;
                });
                if (issue.assignee){
                    assignee = migrateBody.user_mapping.find((user: any) => {
                        return user.github == issue.assignee.login;
                    });
                }
            }

            var issuesStatus = null;
            if (githubColumnsIssues) {
                githubColumnsIssues.forEach(column => {
                    if (column.issues.indexOf(String(issue.number)) >= 0) {
                        issuesStatus = column.column_name;
                    } 
                });
            }
            
            let issueJSON = {
                fields: {
                    summary: issue.title,
                    issuetype: {
                        name: issueType,
                    },
                    assignee: {
                        id: assignee ? assignee.jira : ""
                    },
                    labels: labels ? labels : [],
                    reporter: {
                        id: reporter ? reporter.jira : ""
                    }, 
                    description: issue.body ? issue.body : ""
                },
                status: {
                    name: issuesStatus ? issuesStatus : "Backlog",
                },
                priority: {
                    name: priority
                },
                created: issue.created_at,
                resolved: issue.closed_at,
                resolution: issue.state == "closed" ? "Done" : ""
            }
            return issueJSON;
        });
    }

    export function updateJiraIssuesDescription(jiraIssues: Array<any>, githubIssues: Array<any>): Array<any> {
        let jsonMD = mdTranslator("");
        return [];
    }

    function getIssueType(labels: Array<string>, bugTag: string, epicTag: string): string {
    var issueType = "Story";
            if (bugTag) {
                issueType = labels.indexOf(bugTag) >= 0 ? "Bug" : issueType;
            }
            if (epicTag) {
                issueType = labels.indexOf(epicTag) >= 0 ? "Epic" : issueType;
            }
        return issueType;
    }

    function getBugPriority(labels: Array<string>, priorities: any): string {
        var priority = "";    
        labels.forEach(label => {
            switch (label) {
                case priorities.high: {
                    priority = "High";
                    break;
                }
                case priorities.medium: {
                    priority = "Medium";
                    break;
                }
                case priorities.low: {
                    priority = "Low";
                    break;
                }
                default: {
                    priority = "Normal";
                    break;
                }
            }
        });
        return priority;
    }

    function getLabelsFromTitle(title: string): Array<string> {
        let newLabels = [];
        newLabels = title.match(/(?<=\[).+?(?=\])/g);
        return newLabels ? newLabels : [];
    }
}
import type { MigrateBody } from "./types"

export module DataTransformer {
    export function githubIssuesToJSON(githubIssues: any, migrateBody: MigrateBody): any {
        return githubIssues.map((issue: any) => {
            const labelsObjects = (issue.labels as Array<any>)
            const labels = labelsObjects.map((label: any) => {
                return label.name;
            });
            const issueType = labels.indexOf("bug") >= 0 ? "Bug" : "Story";
            const reporter = migrateBody.user_mapping.find((user: any) => {
                return user.github == issue.user.login;
            });
            var assignee = null;
            if (issue.assignee){
                assignee = migrateBody.user_mapping.find((user: any) => {
                    return user.github == issue.assignee.login;
                });
            }
            
            const issueJSON = {
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
                    name: issue.state == "closed" ? "Done" : "Backlog",
                },
                created: issue.created_at,
                resolved: issue.closed_at,
                resolution: issue.state == "closed" ? "Done" : ""
            }
            return issueJSON;
        });
    }
}
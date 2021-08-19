import type { MigrateBody } from "./types"

export module DataTransformer {
    export function githubIssuesToJSON(githubIssues: any, migrateBody: MigrateBody): any {
        return githubIssues.map((issue: any) => {
            let labelsObjects = (issue.labels as Array<any>)
            var labels = labelsObjects.map((label: any) => {
                return label.name;
            });
            
            let issueType = getIssueType(labels, migrateBody.github.bug_tag, migrateBody.github.epic_tag);
            
            labels = labels.concat(getLabelsFromTitle(issue.title));

            let reporter = migrateBody.user_mapping.find((user: any) => {
                return user.github == issue.user.login;
            });
            
            var assignee = null;
            if (issue.assignee){
                assignee = migrateBody.user_mapping.find((user: any) => {
                    return user.github == issue.assignee.login;
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
                    name: issue.state == "closed" ? "Done" : "Backlog",
                },
                created: issue.created_at,
                resolved: issue.closed_at,
                resolution: issue.state == "closed" ? "Done" : ""
            }
            return issueJSON;
        });
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

    function getLabelsFromTitle(title: string): Array<string> {
        let newLabels = [];
        newLabels = title.match(/(?<=\[).+?(?=\])/g);
        return newLabels ? newLabels : [];
    }
}
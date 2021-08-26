export const constants = {
    // application
    MIGRATE_POST_PATH: "/migrate",
    // github
    MIGRATE_GITHUB_GET_ISSUES_PATH: "/migrate/github_issues",
    GITHUB_GET_REPO_ISSUES_PATH: "GET /repos/{owner}/{repo}/issues?state={issueState}&per_page={itemsPerPage}&page={pageIndex}&direction=asc",
    GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE: "100",
    GITHUB_COLUMNS_CARD_PATH: "GET /projects/columns/{column_id}/cards?per_page={itemsPerPage}&page={pageIndex}",
    // jira
    MIGRATE_JIRA_GET_ISSUE_DETAIL_PATH: "/migrate/jira_issue",
    MIGRATE_JIRA_BULK_UPDATE_PATH: "/migrate/jira_bulk_create",
    JIRA_HOST: "olxbr.atlassian.net",
    JIRA_ALL_ISSUES_PART_I: "/jira/software/c/projects/",
    JIRA_ALL_ISSUES_PART_II: "/issues/?filter=allissues"
};
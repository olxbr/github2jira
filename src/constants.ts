export const constants = {
    // application
    MIGRATE_POST_PATH: "/migrate",
    // github
    MIGRATE_GITHUB_GET_ISSUES_PATH: "/migrate/github_issues",
    GITHUB_GET_REPO_ISSUES_PATH: "GET /repos/{owner}/{repo}/issues?state={issueState}&per_page={itemsPerPage}&page={pageIndex}&direction=asc",
    GITHUB_REPO_ISSUES_PARAMS_ITEMS_PER_PAGE: "100",
    MIGRATE_GITHUB_REPO_BOARD_PATH: "/migrate/github_board",
    GITHUB_REPO_BOARD_PATH: "GET /repos/{owner}/{repo}/projects?state=open&per_page={itemsPerPage}&page={pageIndex}",
    MIGRATE_GITHUB_REPO_BOARD_COLUMNS_PATH: "/migrate/github_board/columns",
    GITHUB_REPO_BOARD_COLUMNS_PATH: "GET /projects/{board_id}/columns",
    MIGRATE_GITHUB_COLUMNS_CARD_PATH: "/migrate/github_board/columns/cards",
    GITHUB_COLUMNS_CARD_PATH: "GET /projects/columns/{column_id}/cards",
    // jira
    MIGRATE_JIRA_GET_ISSUE_DETAIL_PATH: "/migrate/jira_issue",
    MIGRATE_JIRA_BULK_UPDATE_PATH: "/migrate/jira_bulk_create",
    JIRA_HOST: "olxbr.atlassian.net",
    JIRA_ALL_ISSUES_PART_I: "/jira/software/c/projects/",
    JIRA_ALL_ISSUES_PART_II: "/issues/?filter=allissues",
    JIRA_MIGRATION_message: "migrate at: https://olxbr.atlassian.net/secure/CsvSetupPage!default.jspa?externalSystem=com.atlassian.jira.plugins.jim-plugin%3AcsvImporter&nonImporter=noneOfThese&onboarding=true \n\ndate format: yyyy-MM-dd'T'HH:mm:ss'Z'",
};
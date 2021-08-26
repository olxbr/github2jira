export type MigrateRequest = {
    body: MigrateBody;
};

export type MigrateBody =  { 
    github: { 
        organization_name: string; 
        repo_name: string; 
        auth: string; //user application token on github https://docs.github.com/en/rest/guides/basics-of-authentication
        bug_tag: string;
        epic_tag: string;
        since: string | void; // YYYY-MM-DD'T'HH:MM:SS'Z'
        state: string | void; // all, open and closed
        priorities: {
            high: string;
            medium: string;
            low: string;
        }
    }; 
    jira: {
        user_email: string;
        user_api_token: string;
        project_key: string;
        issue_key: string;
    };
    user_mapping: [
        MigrateMapping
    ];
    status_mapping: [
        MigrateMapping
    ]
};

export type MigrateMapping = {
    github: string;
    jira: string;
};
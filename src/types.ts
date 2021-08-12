export type MigrateRequest = {
    body: MigrateBody;
};

export type MigrateBody =  { 
    since: string | void; // YYYY-MM-DD'T'HH:MM:SS'Z'
    github: { 
        organization_name: string; 
        repo_name: string; 
        auth: string; //user application token on github https://docs.github.com/en/rest/guides/basics-of-authentication
    }; 
    jira: {
        teste: string;
    }
    user_mapping: [
        {
            github: string;
            jira: string; // jira user id
        } 
    ]
};
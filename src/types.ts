export type MigrateRequest = {
    body: MigrateBody;
}

type MigrateBody =  { 
    since: string | void; // YYYY-MM-DDTHH:MM:SSZ
    github: { 
        organization_name: string; 
        repo_name: string; 
        auth: string; //user application token on github https://docs.github.com/en/rest/guides/basics-of-authentication
    }; 
    jira: {
        teste: string;
    }
    user_convertion: {
        teste: string;
    }
};
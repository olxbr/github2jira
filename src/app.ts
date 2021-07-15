import { Octokit } from "@octokit/core";
import express from 'express';

const app = express()
app.listen(3000);

app.get('/', async (request, response) => {
    await getGithubIssuesFrom("olxbr", "squad-aluguel").then(result => {
        // console.log(result);
        response.status(200).json({ message: result}); 
    }).catch(err => {
        response.status(err.response.status).json({ message: err.response.data.message});
    });
});

async function getGithubIssuesFrom(ownerName: string, repoName: string): Promise<JSON> {
    const octokit = new Octokit({ auth: "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"});

    const response = await octokit.request("GET /repos/{owner}/{repo}/issues?state={issueState}&per_page={itemsPerPage}&page={pageIndex}", {
        owner: ownerName,
        repo: repoName,
        issueState: "all",
        itemsPerPage: "100",
        pageIndex: "0"
    }).catch(err => {
        throw err;
    });

    return response.data;
}


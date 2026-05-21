const core   = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");

const { checkApproved, getPendingMessage, buildComment } = require("./approval");
const { fetchReviews, buildApprovalCounts, upsertPrComment } = require("./github");

function getOAuthAppOctokit(clientId, clientSecret) {
  return new Octokit({
    authStrategy: createOAuthAppAuth,
    auth: { clientId, clientSecret },
  });
}

async function run() {
  const commentOctokit = github.getOctokit(core.getInput("github-token", { required: true }));
  const { owner, repo } = github.context.repo;

  const appId    = core.getInput("app-id",      { required: true });
  const prNumber = parseInt(core.getInput("pr-number",               { required: true }), 10);
  const minTotal = parseInt(core.getInput("total-required-approvals", { required: true }), 10);

  const reviewerTeams = {
    maintainer: core.getInput("maintainers-github-team", { required: true }),
    teamLead:   core.getInput("team-leads-github-team",  { required: true }),
  };

  const orgOctokit = getOAuthAppOctokit(
    core.getInput("client-id",     { required: true }),
    core.getInput("client-secret", { required: true }),
  );

  const reviews = await fetchReviews(commentOctokit, owner, repo, prNumber);
  const counts  = await buildApprovalCounts(orgOctokit, owner, repo, reviews, reviewerTeams);

  const approved       = checkApproved(counts, minTotal);
  const pendingMessage = approved ? "" : getPendingMessage(counts, minTotal);
  const commentBody    = buildComment(approved, counts, pendingMessage);

  await upsertPrComment(commentOctokit, owner, repo, prNumber, commentBody);
}

run().catch((error) => core.warning(`Action did not complete: ${error.message}`));

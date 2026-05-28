const core   = require("@actions/core");
const github = require("@actions/github");
const { createAppAuth } = require("@octokit/auth-app");

const { checkApproved, getPendingMessage, buildComment } = require("./approval");
const { fetchReviews, buildApprovalCounts, upsertPrComment } = require("./github");

async function getInstallationOctokit(appId, privateKey, owner, repo) {
  const auth = createAppAuth({ appId: parseInt(appId, 10), privateKey });

  const { token: jwtToken } = await auth({ type: "app" });
  const appOctokit = github.getOctokit(jwtToken);
  const { data: installation } = await appOctokit.rest.apps.getRepoInstallation({ owner, repo });

  const { token } = await auth({ type: "installation", installationId: installation.id });
  return github.getOctokit(token);
}

async function run() {
  const commentOctokit = github.getOctokit(core.getInput("github-token", { required: true }));
  const { owner, repo } = github.context.repo;

  const prNumber = parseInt(core.getInput("pr-number",               { required: true }), 10);
  const minTotal = parseInt(core.getInput("total-required-approvals", { required: true }), 10);

  const reviewerTeams = {
    maintainer: core.getInput("maintainers-github-team", { required: true }),
    teamLead:   core.getInput("team-leads-github-team",  { required: true }),
  };

  const orgOctokit = await getInstallationOctokit(
    core.getInput("app-id",      { required: true }),
    core.getInput("private-key", { required: true }),
    owner, repo,
  );

  const reviews = await fetchReviews(commentOctokit, owner, repo, prNumber);
  const counts  = await buildApprovalCounts(orgOctokit, owner, repo, reviews, reviewerTeams);

  const approved       = checkApproved(counts, minTotal);
  const pendingMessage = approved ? "" : getPendingMessage(counts, minTotal);
  const commentBody    = buildComment(approved, counts, pendingMessage);

  await upsertPrComment(commentOctokit, owner, repo, prNumber, commentBody);
}

run().catch((error) => core.warning(`Action did not complete: ${error.message}`));

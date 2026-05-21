# check-pending-reviews

A JavaScript GitHub Action that checks PR approval requirements by role and posts an
informational comment on the PR.

## What it does

1. Fetches all reviews for the PR and collapses them to the latest review per reviewer.
2. Resolves each approver's role by checking their team membership via a **GitHub App**
   installation token (maintainer → team lead → other).
3. Only counts approvers who have at least **write** access to the repository (write,
   maintain, or admin).
4. Evaluates the approval gate:
   - At least **1 codeowner** (maintainer **or** team lead), **and**
   - At least **`total-required-approvals`** total approvals across all roles.
5. Creates or updates a `## Review Status` comment on the PR summarising the current state.

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `app-id` | ✅ | — | GitHub App ID. The app requires **Members (read)** repository permission and **Members (read)** organisation permission. |
| `private-key` | ✅ | — | GitHub App private key (PEM format). |
| `github-token` | ❌ | `${{ github.token }}` | Token used to post/update the PR comment (the built-in `GITHUB_TOKEN` is sufficient). |
| `pr-number` | ✅ | — | PR number to check. |
| `maintainers-github-team` | ✅ | — | GitHub team slug for maintainer approvers (e.g. managers). Used for urgent or escalated merges. |
| `team-leads-github-team` | ✅ | — | GitHub team slug for team lead approvers. Primary reviewers whose approval is required to merge. |
| `total-required-approvals` | ✅ | `2` | Minimum number of total approvals (across all roles) required. |

## Example usage

```yaml
- name: Check pending reviews
  uses: oss-actions/check-pending-reviews@v1
  with:
    app-id: ${{ secrets.APP_ID }}
    private-key: ${{ secrets.APP_PRIVATE_KEY }}
    pr-number: ${{ github.event.pull_request.number }}
    maintainers-github-team: my-maintainers-team
    team-leads-github-team: my-team-leads-team
    total-required-approvals: 2
```

> The built-in `GITHUB_TOKEN` is used for posting the PR comment by default. Override
> `github-token` if you need the comment to appear under a different identity.

## PR comment format

The action creates (or updates) a single comment on the PR:

```
## Review Status
**Current Status: ✅ APPROVED**
Approvals so far: Management 1, Team Lead 1
```

When approval is still pending:

```
## Review Status
**Current Status: ❌ PENDING**
Approvals so far: Management 0, Team Lead 1, Member 0

Pending reviews: Needs 1 more from Management, Team Lead, or Member.
```

## Development

```bash
npm install
npm test          # run Jest unit tests
npm run build     # bundles src/index.js → dist/index.js via Rollup
```

Commit both `src/index.js` and `dist/index.js`. The runner executes `dist/index.js`
directly — no install step needed at runtime.

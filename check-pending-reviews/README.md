# pending-reviews

A JavaScript GitHub Action that checks PR approval requirements by role and reports
the result as a commit status + an informational PR comment.

## What it does

1. Fetches all reviews for the PR and collapses them to the latest review per reviewer.
2. Resolves each approver's role by checking their team membership (management, team lead, team member).
3. Evaluates the approval paths:
   - 2 × management, **or**
   - 1 × management + 1 × team lead, **or**
   - 2 × team lead, **or**
   - 1 × team lead + 1 × team member
4. Posts a `Pending Reviews` commit status to the PR head SHA (`success` or `pending`).
5. Creates or updates an informational comment on the PR summarising the current state.

## Inputs

| Input | Required | Description |
|---|---|---|
| `github-token` | ✅ | PAT with `read:org` (team membership) and `repo` (statuses + comments) scopes |
| `pr-number` | ✅ | PR number to check |
| `pr-sha` | ✅ | PR head SHA to post the commit status on |
| `mgmt-team` | ✅ | GitHub team slug for management approvers |
| `tl-team` | ✅ | GitHub team slug for team lead approvers |
| `member-team` | ✅ | GitHub team slug for team member approvers |

## Example usage

```yaml
- name: Checkout
  uses: actions/checkout@v4

- name: Check pending reviews
  uses: ./.github/actions/pending-reviews
  with:
    github-token: ${{ secrets.PAT_TOKEN }}
    pr-number: ${{ steps.pr.outputs.number }}
    pr-sha: ${{ steps.pr.outputs.sha }}
    mgmt-team: my-mgmt-team
    tl-team: my-tl-team
    member-team: my-member-team
```

## Development

```bash
npm install
npm run build   # bundles src/index.js → dist/index.js via ncc
```

Commit both `src/index.js` and `dist/index.js`. The runner executes `dist/index.js` directly — no install step needed at runtime.

# CodeScan public-repo inventory — `tetherto`

One-shot inventory of every public repository under the `tetherto` GitHub organization, captured to support the Q3 2026 CodeScan rollout (see [codescan-q3-rollout-plan.md](codescan-q3-rollout-plan.md)).

## Scope

- Organization: [`tetherto`](https://github.com/tetherto)
- Repository visibility: `public` only
- Repository count at capture: **133**
- Sister / related orgs (e.g. `holepunchto`): out of scope, per ticket
- Private repos: out of scope, per ticket

## Data as-of

- Capture date: **2026-05-21 (UTC)**
- Source: GitHub REST API v3, authenticated via `gh` CLI
- Snapshot is static. To refresh, re-run the generator below and replace this file in a follow-up PR.

## Summary

| Metric | Value |
| --- | --- |
| Total public repos | 133 |
| `ready-now` | 88 |
| `needs-config` | 23 |
| `archive-candidate` | 13 |
| `out-of-scope` | 9 |
| Tier-1 (subset of `ready-now`) | 53 |
| Status `Active` (pushed <90d) | 121 |
| Status `Dormant` (90–540d) | 4 |
| Status `Stale` (>540d) | 7 |
| Status `Archived` | 1 |
| Forks | 14 |
| Repos with `CODEOWNERS` in default branch | 38 |
| Repos already running CodeQL | 0 |

Primary-language distribution within `ready-now` (88 repos): JavaScript 83, TypeScript 3, Python 2.

## How this was generated

Run from a shell with `gh` authenticated and `read:org` + `repo` scopes (already verified):

```bash
gh api --paginate "/orgs/tetherto/repos?type=public&per_page=100" \
  --jq '.[] | {name, language, archived, pushed_at, default_branch,
               license: (.license.spdx_id // "none"), topics,
               fork, size, html_url, description}'

for repo in $(gh api --paginate "/orgs/tetherto/repos?type=public&per_page=100" --jq '.[].name'); do
  gh api "/repos/tetherto/$repo/languages"                       > "langs/$repo.json"
  gh api "/repos/tetherto/$repo/contents/.github/CODEOWNERS" 2>/dev/null \
    || gh api "/repos/tetherto/$repo/contents/CODEOWNERS"    2>/dev/null \
    || true
done
```

Validation done at capture: `gh api search/code?q=org:tetherto+%22github/codeql-action%22+path:.github` returned `0` hits, so every row's `Current CodeQL` column is `disabled / never-run`.

## Column definitions

| Column | Meaning |
| --- | --- |
| `Repo` | Repository name, linked to GitHub |
| `Primary lang` | GitHub-detected primary language; `_(none)_` if GitHub returned `null` (typically empty repo, docs-only, or vendored binary content) |
| `Other langs` | Top 3 additional detected languages by byte count |
| `Last commit (UTC)` | Date of `pushed_at` (last push to any branch) |
| `Status` | `Active` if pushed <90 days, `Dormant` 90–540 days, `Stale` >540 days, `Archived` if `archived: true` |
| `Primary maintainer` | First non-comment line of `CODEOWNERS` (preferring `.github/CODEOWNERS`); `TBD` if no `CODEOWNERS` file |
| `License` | SPDX id from GitHub; `NOASSERTION` if licence file present but unrecognized; `none` if absent |
| `Current CodeQL` | `disabled / never-run` for all rows on day one |
| `Bucket` | Rollout bucket — see definitions below |
| `Tier-1` | `yes` if this `ready-now` repo is also a Tier-1 candidate for wave 1 (definition in rollout plan) |
| `Notes / blockers` | Short reason for non-`ready-now` placement, or blank |

## Bucket definitions

- **`ready-now`** — not archived, not a fork-only mirror, default branch resolves, primary language is one CodeQL natively supports (JavaScript, TypeScript, Python, Java, Kotlin, C#, C/C++, Go, Ruby, Swift), pushed within last 365 days, no obvious extractor blocker. Safe to enable the canonical reusable workflow with default inputs.
- **`needs-config`** — `ready-now` language but at least one of: fork of upstream (verify local patches first), C/C++ requiring custom build before `autobuild` works, native/mobile/extension build pipeline (React Native, browser-extension, Bare addon), no detected primary language despite recent activity (verify content), monorepo needing per-path matrix, or repo size >5 GB.
- **`archive-candidate`** — propose archive before scan rollout. Either no commits in >540 days AND not referenced by an active QVAC product, OR an empty placeholder repo (≤ 5 KB, no detected language). Recommendation: archive then skip from the rollout.
- **`out-of-scope`** — already-archived, language unsupported by CodeQL (Rust, CMake-only registries, etc.), or non-application-source content (docs, releases, mirrors, reusable workflow registries). Reason recorded inline.

## Caveats and data limitations

- **CODEOWNERS coverage is partial.** 38 of 133 repos publish a `CODEOWNERS` file in the default branch. The remaining 95 show `TBD` and need maintainer attribution by repo owners during PR review.
- **`primary language: null`** does not always mean empty. Several `wdk-*` and `pearpass-*` placeholders are scaffolded but not yet pushed; they may move to `ready-now` before wave 1.
- **`fork: true`** is informational. Forks that carry no local patches should be archived or out-of-scope; forks with local patches are `needs-config` until patches are confirmed.
- **License `NOASSERTION`** indicates a licence file is present but does not match an SPDX identifier GitHub recognizes. Action: confirm intended licence per repo during owner review.
- **No pinned commit SHA.** This snapshot pins repo state by `pushed_at` only; if a repo receives commits between snapshot and rollout-start, its bucket may change. Re-run the generator at the start of each wave to re-bucket.

## Inventory

| Repo | Primary lang | Other langs | Last commit (UTC) | Status | Primary maintainer | License | Current CodeQL | Bucket | Tier-1 | Notes / blockers |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [active_attr](https://github.com/tetherto/active_attr) | Ruby |  | 2024-09-05 | Stale | TBD | MIT | disabled / never-run | archive-candidate |  | no commits in >540 days |
| [bare-crypto](https://github.com/tetherto/bare-crypto) | JavaScript | C, CMake | 2024-11-11 | Stale | TBD | Apache-2.0 | disabled / never-run | archive-candidate |  | no commits in >540 days |
| [fast-text-encoding](https://github.com/tetherto/fast-text-encoding) | _(none)_ | JavaScript, HTML, Shell | 2023-10-12 | Stale | TBD | Apache-2.0 | disabled / never-run | archive-candidate |  | no detected language and not active |
| [pub](https://github.com/tetherto/pub) | _(none)_ |  | 2025-09-30 | Dormant | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [svc-facs-dhcp-kea](https://github.com/tetherto/svc-facs-dhcp-kea) | JavaScript |  | 2024-01-09 | Stale | TBD | none | disabled / never-run | archive-candidate |  | no commits in >540 days |
| [tether-api-client-ruby](https://github.com/tetherto/tether-api-client-ruby) | Ruby |  | 2016-09-08 | Stale | TBD | none | disabled / never-run | archive-candidate |  | no commits in >540 days |
| [tmp-test-0](https://github.com/tetherto/tmp-test-0) | _(none)_ |  | 2024-11-06 | Stale | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [wdk-cli](https://github.com/tetherto/wdk-cli) | _(none)_ |  | 2026-05-05 | Active | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [wdk-pricing-coingecko-http](https://github.com/tetherto/wdk-pricing-coingecko-http) | _(none)_ |  | 2026-03-30 | Active | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [wdk-safe-protocol-kit](https://github.com/tetherto/wdk-safe-protocol-kit) | _(none)_ |  | 2026-05-13 | Active | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [wdk-safe-relay-kit](https://github.com/tetherto/wdk-safe-relay-kit) | _(none)_ |  | 2026-05-13 | Active | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [wdk-signer-local](https://github.com/tetherto/wdk-signer-local) | _(none)_ |  | 2026-04-19 | Active | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [wdk-wallet-solana-gasless](https://github.com/tetherto/wdk-wallet-solana-gasless) | _(none)_ |  | 2026-05-20 | Active | TBD | none | disabled / never-run | archive-candidate |  | empty placeholder repo (size <= 5 KB, no language) |
| [lib-pear-pass](https://github.com/tetherto/lib-pear-pass) | JavaScript |  | 2025-01-08 | Dormant | TBD | Apache-2.0 | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [miningos-cli](https://github.com/tetherto/miningos-cli) | _(none)_ |  | 2026-03-19 | Active | @tetherto/miningos-bk-merge | none | disabled / never-run | needs-config |  | no primary language detected; verify content before enabling |
| [miningos-wrk-minerpool-luxor](https://github.com/tetherto/miningos-wrk-minerpool-luxor) | _(none)_ |  | 2026-03-20 | Active | @tetherto/miningos-bk-merge | none | disabled / never-run | needs-config |  | no primary language detected; verify content before enabling |
| [pearpass-app-browser-extension](https://github.com/tetherto/pearpass-app-browser-extension) | JavaScript | TypeScript, CSS, HTML | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [pearpass-app-desktop](https://github.com/tetherto/pearpass-app-desktop) | JavaScript | TypeScript, Shell, PowerShell | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [pearpass-app-mobile](https://github.com/tetherto/pearpass-app-mobile) | JavaScript | TypeScript, Java, Swift | 2026-05-20 | Active | TBD | NOASSERTION | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [pearpass-lib-ui-react-native-components](https://github.com/tetherto/pearpass-lib-ui-react-native-components) | JavaScript |  | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [qvac-bare-addon-example](https://github.com/tetherto/qvac-bare-addon-example) | C++ | JavaScript, Mermaid, CMake | 2026-05-15 | Active | TBD | none | disabled / never-run | needs-config |  | C/C++ requires custom build before CodeQL autobuild |
| [qvac-ext-bergamot-translator](https://github.com/tetherto/qvac-ext-bergamot-translator) | C++ | JavaScript, Python, CMake | 2026-05-05 | Active | @tetherto/ai-runtime-bk-addons @tetherto/ai-runtime-bk-models @tetherto/ai-runtime-bk-core @tetherto/ai-runtime-merge | MPL-2.0 | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [qvac-ext-ggml](https://github.com/tetherto/qvac-ext-ggml) | _(none)_ | C++, C, Cuda | 2026-05-21 | Active | TBD | MIT | disabled / never-run | needs-config |  | no primary language detected; verify content before enabling |
| [qvac-ext-lib-whisper.cpp](https://github.com/tetherto/qvac-ext-lib-whisper.cpp) | C++ | C, Cuda, Metal | 2026-05-21 | Active | @tetherto/ai-runtime-bk-addons @tetherto/ai-runtime-bk-models @tetherto/ai-runtime-bk-core @tetherto/ai-runtime-merge | MIT | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [qvac-ext-marian-dev](https://github.com/tetherto/qvac-ext-marian-dev) | C++ | Cuda, CMake, HTML | 2026-05-05 | Active | @tetherto/ai-runtime-merge | NOASSERTION | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [qvac-ext-stable-diffusion.cpp](https://github.com/tetherto/qvac-ext-stable-diffusion.cpp) | C++ | C, CMake, Python | 2026-05-21 | Active | TBD | MIT | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [qvac-fabric-llm.cpp](https://github.com/tetherto/qvac-fabric-llm.cpp) | C++ | C, Python, Cuda | 2026-05-17 | Active | @tetherto/qvac-internal-dev | MIT | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [wdk-agent-skills](https://github.com/tetherto/wdk-agent-skills) | _(none)_ |  | 2026-05-05 | Active | TBD | Apache-2.0 | disabled / never-run | needs-config |  | no primary language detected; verify content before enabling |
| [wdk-backup-cloud-react-native](https://github.com/tetherto/wdk-backup-cloud-react-native) | TypeScript | JavaScript | 2026-05-06 | Active | TBD | Apache-2.0 | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [wdk-backup-remote](https://github.com/tetherto/wdk-backup-remote) | _(none)_ |  | 2026-04-16 | Active | TBD | none | disabled / never-run | needs-config |  | no primary language detected; verify content before enabling |
| [wdk-react-native-core](https://github.com/tetherto/wdk-react-native-core) | TypeScript | JavaScript | 2026-05-08 | Active | TBD | Apache-2.0 | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [wdk-react-native-provider](https://github.com/tetherto/wdk-react-native-provider) | TypeScript | JavaScript | 2026-05-19 | Active | TBD | Apache-2.0 | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [wdk-react-native-secure-storage](https://github.com/tetherto/wdk-react-native-secure-storage) | TypeScript | JavaScript | 2026-05-12 | Active | TBD | NOASSERTION | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [wdk-safe-core-sdk](https://github.com/tetherto/wdk-safe-core-sdk) | TypeScript | Solidity, JavaScript, Shell | 2026-05-16 | Active | TBD | MIT | disabled / never-run | needs-config |  | fork of upstream; verify local patches before scanning |
| [wdk-starter-react-native](https://github.com/tetherto/wdk-starter-react-native) | TypeScript | JavaScript | 2026-04-25 | Active | TBD | Apache-2.0 | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [wdk-uikit-react-native](https://github.com/tetherto/wdk-uikit-react-native) | TypeScript | JavaScript | 2026-05-16 | Active | TBD | Apache-2.0 | disabled / never-run | needs-config |  | native/mobile/extension build pipeline; verify CodeQL extractor coverage |
| [flathub](https://github.com/tetherto/flathub) | _(none)_ |  | 2026-04-15 | Active | TBD | LGPL-2.1 | disabled / never-run | out-of-scope |  | docs / releases / mirror, not application source |
| [omnicore](https://github.com/tetherto/omnicore) | _(none)_ |  | 2019-07-22 | Archived | TBD | none | disabled / never-run | out-of-scope |  | archived |
| [oss-actions](https://github.com/tetherto/oss-actions) | _(none)_ |  | 2026-05-15 | Active | TBD | none | disabled / never-run | out-of-scope |  | reusable workflows / actions, no application code to scan |
| [qvac-registry-vcpkg](https://github.com/tetherto/qvac-registry-vcpkg) | CMake |  | 2026-05-21 | Active | TBD | Apache-2.0 | disabled / never-run | out-of-scope |  | build-system files only (CMake) |
| [tether-dev-docs](https://github.com/tetherto/tether-dev-docs) | JavaScript |  | 2026-05-20 | Active | TBD | NOASSERTION | disabled / never-run | out-of-scope |  | docs / releases / mirror, not application source |
| [Tether-Near](https://github.com/tetherto/Tether-Near) | Rust | Shell, JavaScript | 2023-01-20 | Stale | TBD | none | disabled / never-run | out-of-scope |  | Rust not supported by CodeQL |
| [tether-wallet-app-releases](https://github.com/tetherto/tether-wallet-app-releases) | _(none)_ |  | 2026-05-11 | Active | TBD | none | disabled / never-run | out-of-scope |  | docs / releases / mirror, not application source |
| [wdk-docs](https://github.com/tetherto/wdk-docs) | _(none)_ |  | 2026-05-21 | Active | TBD | Apache-2.0 | disabled / never-run | out-of-scope |  | docs / releases / mirror, not application source |
| [wdk-examples](https://github.com/tetherto/wdk-examples) | TypeScript | Python | 2026-05-14 | Active | TBD | none | disabled / never-run | out-of-scope |  | docs / releases / mirror, not application source |
| [create-wdk-module](https://github.com/tetherto/create-wdk-module) | JavaScript |  | 2026-05-12 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [hp-svc-facs-net](https://github.com/tetherto/hp-svc-facs-net) | JavaScript |  | 2026-05-14 | Active | TBD | none | disabled / never-run | ready-now |  |  |
| [hp-svc-facs-store](https://github.com/tetherto/hp-svc-facs-store) | JavaScript |  | 2026-04-30 | Active | TBD | none | disabled / never-run | ready-now |  |  |
| [mdk](https://github.com/tetherto/mdk) | TypeScript | JavaScript, SCSS, Shell | 2026-05-19 | Active | @tetherto/moria-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-app-node](https://github.com/tetherto/miningos-app-node) | JavaScript | HTML, Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-app-ui](https://github.com/tetherto/miningos-app-ui) | TypeScript | JavaScript, CSS, HTML | 2026-05-12 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-lib-stats](https://github.com/tetherto/miningos-lib-stats) | JavaScript |  | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-mock-control-service](https://github.com/tetherto/miningos-mock-control-service) | JavaScript |  | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-tpl-wrk-container](https://github.com/tetherto/miningos-tpl-wrk-container) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-tpl-wrk-electricity](https://github.com/tetherto/miningos-tpl-wrk-electricity) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-tpl-wrk-miner](https://github.com/tetherto/miningos-tpl-wrk-miner) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-tpl-wrk-powermeter](https://github.com/tetherto/miningos-tpl-wrk-powermeter) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-tpl-wrk-sensor](https://github.com/tetherto/miningos-tpl-wrk-sensor) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | none | disabled / never-run | ready-now |  |  |
| [miningos-tpl-wrk-thing](https://github.com/tetherto/miningos-tpl-wrk-thing) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-container-antspace](https://github.com/tetherto/miningos-wrk-container-antspace) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-container-bitdeer](https://github.com/tetherto/miningos-wrk-container-bitdeer) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-container-microbt](https://github.com/tetherto/miningos-wrk-container-microbt) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-dhcp](https://github.com/tetherto/miningos-wrk-dhcp) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-electricity-base](https://github.com/tetherto/miningos-wrk-electricity-base) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-ext-mempool](https://github.com/tetherto/miningos-wrk-ext-mempool) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-ext-openweather](https://github.com/tetherto/miningos-wrk-ext-openweather) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-inventory](https://github.com/tetherto/miningos-wrk-inventory) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-miner-antminer](https://github.com/tetherto/miningos-wrk-miner-antminer) | JavaScript | Shell | 2026-05-08 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-miner-avalon](https://github.com/tetherto/miningos-wrk-miner-avalon) | JavaScript | Shell | 2026-05-08 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-minerpool-f2pool](https://github.com/tetherto/miningos-wrk-minerpool-f2pool) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-minerpool-ocean](https://github.com/tetherto/miningos-wrk-minerpool-ocean) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-miner-whatsminer](https://github.com/tetherto/miningos-wrk-miner-whatsminer) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-ork](https://github.com/tetherto/miningos-wrk-ork) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-powermeter-abb](https://github.com/tetherto/miningos-wrk-powermeter-abb) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-powermeter-satec](https://github.com/tetherto/miningos-wrk-powermeter-satec) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-powermeter-schneider](https://github.com/tetherto/miningos-wrk-powermeter-schneider) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [miningos-wrk-sensor-temp-seneca](https://github.com/tetherto/miningos-wrk-sensor-temp-seneca) | JavaScript | Shell | 2026-05-21 | Active | @tetherto/miningos-bk-merge | none | disabled / never-run | ready-now |  |  |
| [pear-apps-lib-feedback](https://github.com/tetherto/pear-apps-lib-feedback) | JavaScript |  | 2026-05-14 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-lib-ui-react-hooks](https://github.com/tetherto/pear-apps-lib-ui-react-hooks) | JavaScript |  | 2026-05-14 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-utils-avatar-initials](https://github.com/tetherto/pear-apps-utils-avatar-initials) | JavaScript |  | 2026-05-14 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-utils-date](https://github.com/tetherto/pear-apps-utils-date) | JavaScript |  | 2026-05-14 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-utils-generate-unique-id](https://github.com/tetherto/pear-apps-utils-generate-unique-id) | JavaScript |  | 2026-05-14 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-utils-pattern-search](https://github.com/tetherto/pear-apps-utils-pattern-search) | JavaScript |  | 2026-03-20 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-utils-qr](https://github.com/tetherto/pear-apps-utils-qr) | JavaScript |  | 2026-05-18 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pear-apps-utils-validator](https://github.com/tetherto/pear-apps-utils-validator) | JavaScript |  | 2026-05-18 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-constants](https://github.com/tetherto/pearpass-lib-constants) | JavaScript |  | 2026-05-18 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-data-export](https://github.com/tetherto/pearpass-lib-data-export) | JavaScript |  | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-data-import](https://github.com/tetherto/pearpass-lib-data-import) | JavaScript |  | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-native-messaging-bridge](https://github.com/tetherto/pearpass-lib-native-messaging-bridge) | JavaScript |  | 2026-05-17 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-ui-theme-provider](https://github.com/tetherto/pearpass-lib-ui-theme-provider) | JavaScript |  | 2026-05-18 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-vault](https://github.com/tetherto/pearpass-lib-vault) | JavaScript |  | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-lib-vault-core](https://github.com/tetherto/pearpass-lib-vault-core) | JavaScript |  | 2026-05-21 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-utils-password-check](https://github.com/tetherto/pearpass-utils-password-check) | JavaScript |  | 2026-05-18 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [pearpass-utils-password-generator](https://github.com/tetherto/pearpass-utils-password-generator) | JavaScript |  | 2026-05-18 | Active | TBD | NOASSERTION | disabled / never-run | ready-now | yes |  |
| [qvac](https://github.com/tetherto/qvac) | JavaScript | TypeScript, C++, Python | 2026-05-21 | Active | @tetherto/qvac-internal-dev @tetherto/qvac-internal-merge | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [qvac-rnd-fabric-llm-bitnet](https://github.com/tetherto/qvac-rnd-fabric-llm-bitnet) | Python |  | 2026-03-17 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [qvac-rnd-fabric-llm-finetune](https://github.com/tetherto/qvac-rnd-fabric-llm-finetune) | Python |  | 2026-01-27 | Dormant | TBD | none | disabled / never-run | ready-now | yes |  |
| [svc-facs-action-approver](https://github.com/tetherto/svc-facs-action-approver) | JavaScript |  | 2026-04-30 | Active | TBD | MIT | disabled / never-run | ready-now | yes |  |
| [svc-facs-auth](https://github.com/tetherto/svc-facs-auth) | JavaScript |  | 2026-05-14 | Active | TBD | none | disabled / never-run | ready-now | yes |  |
| [svc-facs-httpd](https://github.com/tetherto/svc-facs-httpd) | JavaScript |  | 2026-05-07 | Active | TBD | none | disabled / never-run | ready-now | yes |  |
| [svc-facs-httpd-oauth2](https://github.com/tetherto/svc-facs-httpd-oauth2) | JavaScript |  | 2026-04-30 | Active | TBD | none | disabled / never-run | ready-now | yes |  |
| [svc-facs-logging](https://github.com/tetherto/svc-facs-logging) | JavaScript |  | 2026-04-30 | Active | TBD | none | disabled / never-run | ready-now | yes |  |
| [svc-facs-miningos-net](https://github.com/tetherto/svc-facs-miningos-net) | JavaScript |  | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [svc-facs-miningos-thg-write-calls](https://github.com/tetherto/svc-facs-miningos-thg-write-calls) | JavaScript |  | 2026-05-21 | Active | @tetherto/miningos-bk-merge | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [svc-facs-modbus](https://github.com/tetherto/svc-facs-modbus) | JavaScript |  | 2026-05-06 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [svc-facs-mqtt](https://github.com/tetherto/svc-facs-mqtt) | JavaScript |  | 2026-04-30 | Active | TBD | none | disabled / never-run | ready-now | yes |  |
| [svc-facs-tcp](https://github.com/tetherto/svc-facs-tcp) | JavaScript |  | 2026-04-30 | Active | TBD | MIT | disabled / never-run | ready-now | yes |  |
| [tether-svc-test-helper](https://github.com/tetherto/tether-svc-test-helper) | JavaScript |  | 2026-05-05 | Active | TBD | none | disabled / never-run | ready-now |  |  |
| [tether-wrk-base](https://github.com/tetherto/tether-wrk-base) | JavaScript | Shell | 2026-05-18 | Active | TBD | none | disabled / never-run | ready-now |  |  |
| [wdk](https://github.com/tetherto/wdk) | JavaScript |  | 2026-05-21 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now |  |  |
| [wdk-failover-provider](https://github.com/tetherto/wdk-failover-provider) | JavaScript |  | 2026-05-07 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-indexer-http](https://github.com/tetherto/wdk-indexer-http) | JavaScript |  | 2026-01-09 | Dormant | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-mcp-toolkit](https://github.com/tetherto/wdk-mcp-toolkit) | JavaScript |  | 2026-05-14 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-pricing-bitfinex-http](https://github.com/tetherto/wdk-pricing-bitfinex-http) | JavaScript |  | 2026-04-16 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-pricing-provider](https://github.com/tetherto/wdk-pricing-provider) | JavaScript |  | 2026-05-15 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-protocol-bridge-usdt0-evm](https://github.com/tetherto/wdk-protocol-bridge-usdt0-evm) | JavaScript |  | 2026-05-15 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-protocol-fiat-moonpay](https://github.com/tetherto/wdk-protocol-fiat-moonpay) | JavaScript |  | 2026-04-18 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-protocol-lending-aave-evm](https://github.com/tetherto/wdk-protocol-lending-aave-evm) | JavaScript |  | 2026-04-19 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-protocol-swap-velora-evm](https://github.com/tetherto/wdk-protocol-swap-velora-evm) | JavaScript |  | 2026-05-14 | Active | TBD | none | disabled / never-run | ready-now | yes |  |
| [wdk-secret-manager](https://github.com/tetherto/wdk-secret-manager) | JavaScript |  | 2026-05-06 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-utils](https://github.com/tetherto/wdk-utils) | JavaScript |  | 2026-05-18 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet](https://github.com/tetherto/wdk-wallet) | JavaScript |  | 2026-04-28 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-btc](https://github.com/tetherto/wdk-wallet-btc) | JavaScript |  | 2026-04-29 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-evm](https://github.com/tetherto/wdk-wallet-evm) | JavaScript |  | 2026-04-29 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-evm-7702-gasless](https://github.com/tetherto/wdk-wallet-evm-7702-gasless) | JavaScript |  | 2026-05-20 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-evm-erc-4337](https://github.com/tetherto/wdk-wallet-evm-erc-4337) | JavaScript |  | 2026-05-21 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-solana](https://github.com/tetherto/wdk-wallet-solana) | JavaScript |  | 2026-05-20 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-spark](https://github.com/tetherto/wdk-wallet-spark) | JavaScript |  | 2026-04-30 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-ton](https://github.com/tetherto/wdk-wallet-ton) | JavaScript |  | 2026-05-12 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-ton-gasless](https://github.com/tetherto/wdk-wallet-ton-gasless) | JavaScript |  | 2026-05-15 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-tron](https://github.com/tetherto/wdk-wallet-tron) | JavaScript |  | 2026-05-09 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-wallet-tron-gasfree](https://github.com/tetherto/wdk-wallet-tron-gasfree) | JavaScript |  | 2026-05-09 | Active | TBD | Apache-2.0 | disabled / never-run | ready-now | yes |  |
| [wdk-worklet-bundler](https://github.com/tetherto/wdk-worklet-bundler) | TypeScript | JavaScript | 2026-05-09 | Active | TBD | none | disabled / never-run | ready-now | yes |  |

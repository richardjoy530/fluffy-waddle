# Contributing to the Wbskt website

How changes are written, committed and reviewed in this repo.

## Commit messages

Every commit subject, and every PR title, follows [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <summary>

<body: why the change was needed, not a list of what changed>

Closes #N
```

- **type** is one of `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`.
- **scope** names the part of the code the change touches (home, docs, pricing, features, layout, seo, ci).
  Leave it out, as in `docs: …`, when a change spans the repo.
- **summary** is lower case, in the imperative, with no full stop, and under about 72 characters:
  `fix(home): keep the hero readable at phone width`.
- One logical change per commit. Squash fix-ups before review rather than leaving "fix review" commits.
- Older history also has `(feat): …` and unprefixed subjects. Don't copy them.

PRs are merged by rebase, so each commit lands on `master` exactly as written. That is why the
commits, not only the PR title, follow the format.

## Branches and merging

- Never create a merge commit. Rebase onto `master` to catch up, and merge PRs with rebase (or squash).
- Never force-push a branch someone else owns or `master` itself.

## Pull requests

1. Find the GitHub issue(s) the change addresses and link them in the body (`Closes #N`, or `Refs #N`
   when it only does part of the work). Open an issue first if there is none.
2. Run the checks below before pushing.
3. **Review it again once it's open.** Read the full diff on GitHub as a fresh reviewer, not as the
   author: correctness and edge cases, concurrency and lock order, error handling, missing tests, and
   these conventions. Push fixes as follow-up commits, then add a line to the PR body:
   `Post-open review: <what was found and fixed, or "nothing found">`.
4. Wait for CI to pass, then ask for the merge.

## Checks before pushing

```bash
npm ci
npm run build    # prerenders every route; a broken page fails here
```

Pushes to `master` deploy straight to GitHub Pages at wbskt.com, so build before you merge.

## Product docs

The docs under `app/src/app/pages/docs` describe how the product behaves, and they follow the code in
wbskt/Wbskt and wbskt/Wbskt.Console. Those repos ask every PR that changes behaviour for a
`Product docs:` line linking the PR here that documents it.

- Each docs page leads with what a user sees and does, then a **What happens when…** list of
  scenarios, then an **In depth** block with the endpoints, error codes and exact rules.
- Write from the code, not from memory, and say "For now" where the console doesn't do yet what the
  platform does.
- `node scripts/docs-coverage.mjs ../Wbskt` checks that every node kind has a page and every API error
  code is documented, and that `/docs/scenarios` lists every page's "What happens when…" question. CI
  runs it on each PR against wbskt/Wbskt `master`, so a site PR can fail on a code the backend added
  since; document it in the same PR. A weekly run files an issue for anything new. It also fails on a
  code in `data/errors.ts` the backend no longer has. A code that isn't for product docs (staff or
  host-to-host only) goes in `scripts/docs-coverage-ignore.json` with the reason.

# Changelog

## 0.6.4 (2026-10-12)

- Bundle wp-release 0.13.0.

## 0.6.3 (2026-10-12)

- Bundle wp-release 0.12.0.

## 0.6.2 (2026-10-12)

- Bundle wp-release 0.11.0.

## 0.6.1 (2026-10-12)

- Update the bundled-dependency documentation of the three actions, and the release configuration re-releases them with the dependents policy. ([#238](https://github.com/wpelevator/basement/pull/238) by @kasparsd, [`04fa1be`](https://github.com/wpelevator/basement/commit/04fa1be25aeef5e39e018d874d9a8dde54a5179a))
- Bundle wp-release 0.10.0.

## 0.6.0 (2026-10-12)

- Expose opt-in Git `export-ignore` exclusions through the release actions. ([#236](https://github.com/wpelevator/basement/pull/236) by @kasparsd, [`f4cd6f1`](https://github.com/wpelevator/basement/commit/f4cd6f1ab2c8f1f34050547e1047b5a21047220c))

## 0.5.2 (2026-10-11)

- Bundle wp-release 0.7.0.

## 0.5.1 (2026-10-11)

- Keep the release actions pinned to a stable wp-release version while the monorepo root resolves them to its local workspace; support explicit changelog insertion markers before the first version heading.

## 0.5.0 (2026-10-11)

- Version mismatches are annotated on the file and line of each version that doesn't match, such as the `Version` header or the readme `Stable tag`, instead of one error with every mismatch.
- Each deploy adds a section to the job summary: the plugin linked to its WordPress.org page, the version, the written SVN paths, the commit linked to its changeset or the dry run result, and the SVN changes. A failed deploy adds the version mismatches or the error.
- Bundles `@wpelevator/wp-release` 0.5.0.

## 0.4.0 (2026-10-10)

- `svn-tag` without `trunk` now builds the tag from the source files instead of copying the repository's trunk, so a pre-release like `1.5.1-rc.1` can be tagged without touching trunk. The `Version` header must match the tag, and the readme `Stable tag` isn't checked. `trunk` with `svn-tag` still copies the synced trunk.

## 0.3.0 (2026-10-10)

- Pre-release versions like `1.5.1-rc.1` can now be used as an `svn-tag`. Syncing a pre-release version to `trunk` still warns.
- Restored the `readme-only` input, which 0.2.0 removed. It syncs only the readme to `trunk/` for updates between releases, and can't be combined with `svn-tag`.

## 0.2.0 (2026-10-09)

- `svn-tag` no longer requires `trunk`. Without `trunk`, the tag is copied from the current `trunk/` in the repository.
- Removed the `readme-only` input: a deploy writes the whole trunk or nothing to it. Assets can still be updated alone with `assets-dir`.
- New `svn-username` and `svn-password` inputs as an alternative to the `SVN_USERNAME` and `SVN_PASSWORD` environment variables. The inputs win when both are set, and the password is masked in the logs.

## 0.1.1 (2026-10-09)

- Renamed the action to "WP Release Deploy SVN", so that its GitHub Marketplace listing matches the action repository: `github.com/marketplace/actions/wp-release-deploy-svn`. Workflows keep using `wpelevator/wp-release-deploy-svn`.

## 0.1.0 (2026-10-09)

- First release: deploys plugins to the WordPress.org plugin SVN repository with `trunk`, `readme-only`, `svn-tag` and `assets-dir` inputs, using `wp-release deploy-svn`.

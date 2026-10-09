# Current state - BinderCopy macOS

## Objective

Ship BinderCopy iPhone and macOS free through Apple unlisted distribution, preserving the accepted design. All admitted people receive generation with $5 per person per UTC month; only verified Sagar is unlimited. Keep private Library records, remove external export/download/sharing, process card-reference images without persistent VPS image caching. Sunset the frozen PWA only after native availability is confirmed.

## Verified state

- Production backend bbbbec3216a07e74ecf65dc6bf6a990cdd05b649 is live at https://bindercopy-api.clearpathsystems.tools after staging, backups, full tests and promotion. Contract 0.2.4 remains pinned to 160e698 in both clients; catalog 21,256 cards.
- Removed 430 historical card-image cache files (11,742,210 bytes) from production/staging. Two authenticated public requests succeeded and recreated no artwork/vision-images directories. Image serving, palettes, tagging references and visual indexing now process image bytes in memory. Caddy has no image response cache; device display caching and derived embeddings/colors remain.
- Exact verified owner membership enforces $5/month across devices, reservations, uncertain outcomes and permanent person binding. Purchases are disabled. Supported gpt-image-2.5-flare-2026-09-08 passed one real generation and idempotent replay: $0.013605. Last verified owner October total $0.040243, remaining $4.959757; no further paid calls this checkpoint.
- Offline recovery drill preserved deletion denial, unrelated pages, usage, immutable person bindings, pricing halt and the catalog; source unchanged, drill not promoted.
- Standard password reviewer account is provisioned, live sign-in verified, normal user role/no staff powers, generation enabled and $5/month. Native export routes return 404; private pages remain available. Credentials are stored only in protected operator files and Apple's private review fields.
- Public /privacy and /support pages are live with michael@clearpathsystems.tools, factual image/data handling and attribution. Native billing configuration exposes the privacy URL. Anonymous account endpoints still return 401. Both URLs and revised descriptions/review notes are saved in Apple's drafts.
- Apple pricing is Free; both 1.1.0 platform drafts use MANUAL release. Both iPhone and Mac App Review are WAITING_FOR_REVIEW (1.1.0 build 12). The unlisted request was submitted with explicit owner acknowledgment, and Apple displayed its receipt confirmation. iPhone 12 is VALID, IN_BETA_TESTING and attached to the manual iOS draft; Mac 12 is also VALID, IN_BETA_TESTING and attached to its manual draft. Mac 10/11 are superseded and unassigned.

## Active work

Build 12 source iPhone bf81c07 / Mac 617bc33 removes external export/download controls and the Mac save-panel bridge, adds standard password sign-in and legal attribution. Both archives passed signing, package/endpoints/decoded-secret and free-release checks. iPhone native UI 37874483990 passed one 13 Pro flow; Mac signed UI 37874489191 passed three tests with zero failures in 100.593 seconds. Both packages are VALID, assigned to internal TestFlight, and attached to manual 1.1.0 drafts.

Package SHA256: iPhone d4a0c4e2110cc9a892e2cdf0a6531aa0c484e0d74fabd14850086209461ca845; Mac 2410b0a6f26286f474cbfef2e280880e37729293ed852984a222a5d03d423ec4.

Screenshot-only iPhone beea530 / Mac 132d3dd do not alter production runtime. iPhone capture 37875843015 passed; three actual 1284x2778 screenshots were visually inspected, uploaded and reached COMPLETE in Apple. Mac capture 37876744933 produced a valid, visually inspected 1280x800 builder screenshot, then failed at XCTest targeting the next control. The valid builder image is uploaded and COMPLETE; the optional three-image capture sequence did not pass. Separate build-12 native interaction verification remains passed. Privacy declaration is published with owner confirmation; Reference category, 9+ calculated rating and US-only initial availability are saved. Native Mac is separate; iPhone-on-Mac and Vision Pro distribution are opted out. Content-rights declaration records owner's asserted legally permitted reference-use basis, not a supplied license. Final reviewer notes and private credentials are saved. iPhone 1.1.0 (12) is submitted and WAITING_FOR_REVIEW. Mac 1.1.0 (12) is also submitted and WAITING_FOR_REVIEW. The unlisted request was submitted with explicit owner confirmation; Apple displayed “Thank you for your submission.” Approval is pending.

## Blockers

Owner clarification is pending on whether user-generated backgrounds should also stop being stored on the VPS. Card-reference cache removal is complete; generated assets and private account/layout/collection records are preserved, and published text describes current behavior. Sagar needs one verified sign-in before exact-identity admission/admin/unlimited binding. No email-only grants.

Owner supplied review phone and approved reviewer password access. Public support email is confirmed. Owner states a reference-use/fair-use basis analogous to media-library thumbnails; no third-party license was supplied. Describe the purpose and attribution accurately without claiming ownership of third-party content or guaranteed legal approval. Apple may request more information. Do not change pending paid agreement, tax or banking records.

## Next actions

1. Await Apple App Review and the unlisted-distribution decision. Both native 1.1.0 (12) versions are WAITING_FOR_REVIEW and MANUAL release. Do not rebuild/reupload or release publicly while awaiting unlisted approval.
2. If Apple requests information, use backend docs/RELEASE_1_1_0_BUILD_12.md and APP_STORE_SUBMISSION_DRAFT.md. Submission receipt is verified, not approval. Optional Mac screenshot automation captured one accepted builder image, then encountered an XCTest hit-point failure; do not label that sequence passed. Earlier release interaction checks passed independently.
3. Resolve generated-background retention with owner; update implementation/disclosures if changed. Bind verified Sagar and known invited friends individually.
4. After native availability, follow backend docs/PWA_RETIREMENT.md to archive dirty PWA working tree and Git history under F:/Desktop/m, retire only its tunnel and PWA-specific settings, preserve shared native services.

## Verification

108 backend tests/typecheck passed locally and in Linux staging/production. Python visual-index mocked fetch verified fresh requests, correct crops and zero persisted image files. Latest native source: 27 iPhone and 28 Mac tests/typechecks plus boundary/docs checks passed. Prior iPhone 13 Pro parity 37870334274 passed one flow; prior Mac 37870088531 passed three tests. These prior checks do not substitute for build-12 UI results. Physical device acceptance and Apple approval are not claimed.

Evidence: backend .local/transient-production-deploy.log, .local/reference-cache-removal.json, .local/transient-reference-verification.json; VPS /var/lib/bindercopy/monitor/transient-reference-verification.json and /var/backups/bindercopy/unlisted-restore-drill-c132ed7. Native artifacts are under each repo's .local/release-<run> and .local/unlisted-ui-<run>.

## Last checkpoint

October 9 UTC (October 8 local): card-reference cache removal live; reviewer and public information pages verified; both build-12 native archives and interaction checks passed; both native versions WAITING_FOR_REVIEW and the unlisted request received by Apple. Shared budget $391.475258 counted/reserved, $108.524742 unreserved, including $9 already reserved for build-12 iPhone archive/UI; Mac standard public runners included. No further paid inference. Preserve unrelated backend docs/NATIVE_USER_GUIDE.md, both docs/UI_PARITY.md and iPhone MINOR_TODO_AND_IDEAS.txt.

An additional $4.50 is already reserved for the store screenshot run; do not count it twice.

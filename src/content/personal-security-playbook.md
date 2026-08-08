# Personal Security Playbook
### Budget → No-Limit, Zero to Full Coverage

Modeled on the structure real security teams use — domain-by-domain controls, tiered by investment, backed by incident-response runbooks for when prevention fails. This is the reference document; the companion **Stack Builder** is the interactive tool for auditing your current setup against it.

---

## How this document is organized

1. **Threat Modeling & Governance** — the meta-layer that decides how hard you should be working at all of this
2. **Twelve control domains**, each with Budget / Mid / No-Limit tiers (the "spidergraph" — coverage across every axis, not depth on one)
3. **Incident Response Runbooks** — what a security team actually does when something goes wrong, adapted to personal scale
4. **Maintenance Cadence** — the audit calendar that keeps this from decaying into a one-time project

A real security program isn't "buy the most expensive thing in every category." It's balanced coverage across domains, sized to an honest threat model. Skipping Phase 0 and jumping straight to hardware keys and a $130/month VPN is a classic mistake — professionals call it security theater when spend doesn't map to actual risk.

---

## 0. Threat Modeling & Governance

Before any tier selection, answer these — write the answers down, revisit every 6 months:

| Question | Why it matters |
|---|---|
| What am I actually protecting? | Identity, financial access, location, communications, source material, reputation — pick your top 3, not all of them |
| Who is the realistic adversary? | Opportunistic (data brokers, credential-stuffing bots, spam) vs. targeted (an individual, a stalker, a competitor) vs. state-level — 95% of people are only ever facing the first category, and over-engineering for the third wastes money that should go toward the first |
| What's the cost of failure per domain? | A leaked email address costs you spam. A leaked home address costs you physical safety. Weight spend accordingly — this is why identity/OSINT hardening usually outranks VPN choice |
| What's my actual friction tolerance? | A $400/year tool you abandon in a month protects you less than a free tool you use daily |

**Professional framing worth adopting**: treat this like a security program with an owner (you), an asset inventory (accounts, devices, data), a risk register (what could go wrong, ranked), and a review cadence — not a shopping list.

---

## 1. Identity & Account Foundation

The root layer. Everything downstream depends on this being solid first.

| | **Budget ($0–50/yr)** | **Mid ($50–300/yr)** | **No-Limit ($300+/yr)** |
|---|---|---|---|
| Password manager | Bitwarden free tier | Bitwarden Premium ($10/yr) or Proton Pass (bundled) | 1Password with Families/Business-grade admin controls + dedicated secrets manager for any dev work |
| Email | Proton Mail free (1 address) | Proton Mail Plus or full Proton Unlimited | Proton Unlimited + a second, fully compartmentalized provider (e.g. Tuta) for identity separation, custom domain email |
| Email aliasing | SimpleLogin/Addy.io free tier (10 aliases) | SimpleLogin Premium (bundled free in Proton Unlimited) | Custom domain + catch-all aliasing so every relationship gets a unique, revocable address |
| Unique passwords everywhere | Manual rotation using the free password manager | Same, fully enforced | Same + breach-monitoring integration (Have I Been Pwned API watch on all aliases) |

**Non-negotiable at every tier**: every account gets a unique, generated password. This is the single highest-leverage action in the entire document and it's free.

---

## 2. Authentication & Hardware Security

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| 2FA method | Free TOTP app (Ente Auth, Aegis) | Same, on every account that supports it | Same, plus... |
| Hardware key | — (skip until budget allows) | 1x YubiKey ($25–60) on email + password manager | 2x YubiKeys (primary + geographically separate backup), registered on every FIDO2-capable account, plus a dedicated key reserved solely for a cold-storage/crypto use case if applicable |
| Device-level | Screen lock, auto-encrypt (usually free/default) | Full-disk encryption verified on every device (LUKS, FileVault, BitLocker) | Hardware security module (TPM) attestation checked, Secure Boot enforced, tamper-evident device storage when traveling |
| Recovery | Write down recovery codes, store offline (paper, safe) | Same + a dedicated fireproof document safe | Same + a secondary offsite location (safe deposit box) for recovery materials, split-knowledge for anything truly critical |

**Key clarification often missed at the Mid/No-Limit tier**: most consumer services (Proton included) use hardware keys as a *second factor alongside a password*, not true passwordless FIDO2 login. Don't architect around an assumption of passwordless that the provider doesn't actually support yet — verify per-service.

---

## 3. Operating Systems & Endpoint

OS hardening rows are split by platform below — pick the row(s) matching what you actually run, desktop and mobile independently.

Privacy Guides and Techlore both point to Linux (desktop) and GrapheneOS (Android) as the stronger privacy default — mainstream proprietary OSes ship with telemetry that's genuinely difficult to fully remove, which is the core of that reasoning. Neither source treats staying on Windows, macOS, or iOS as a failure to correct, though: Techlore has written explicitly against shaming people for the informed, often practical decision to stay in an ecosystem (work software, hardware, comfort). The rows below give every platform — including Windows and macOS — a real Budget → No-Limit hardening ceiling, not just a nudge to switch.

*Sources: Privacy Guides, [Linux Overview](https://www.privacyguides.org/en/os/linux-overview/) and [Windows Overview](https://www.privacyguides.org/en/os/windows/); Techlore, ["The Real Privacy Enemy is Ourselves"](https://techlore.tech/the-real-privacy-enemy-is-ourselves/).*

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Desktop OS — Windows | Fully patched, local account (not a Microsoft account), device encryption/BitLocker verified on | Windows Pro + Group Policy privacy hardening (Recall and Copilot telemetry disabled, default OneDrive backup off) | Windows Pro or Education, hardened, + Windows Sandbox or a Hyper-V isolated VM for untrusted/sensitive tasks — avoid modified ISOs like Tiny11 or Windows AME, they fall behind on security updates and antivirus definitions |
| Desktop OS — macOS | Fully patched, FileVault enabled, firewall on | Same + Lockdown Mode enabled, Advanced Data Protection (or iCloud sync disabled), Standard (non-admin) daily account | Apple Silicon Mac (M2 or newer, for Secure Page Table Monitor/Trusted Execution Monitor) + Lockdown Mode as standing default, firewall set to block all incoming, MAC address randomized per network |
| Desktop OS — Linux | Any mainstream distro, fully patched, auto-update on | Fedora Atomic (Silverblue/Kinoite) or similar immutable distro | Secureblue (hardened atomic fork) or Qubes OS for compartmentalized, VM-isolated computing |
| Mobile OS — iOS | Stock iOS, hardened settings (App Tracking Transparency off, ad ID reset) | Same + quarterly privacy/permission report audits | Lockdown Mode as standing default |
| Mobile OS — Android | Stock Android, hardened settings (ad ID reset, Play Protect on) | Same + quarterly permission audits, sensitive apps isolated in a separate profile | GrapheneOS on a Pixel — only Pixel hardware supports it, due to firmware/bootloader requirements |
| Antivirus/EDR | Built-in OS protection (Windows Defender, macOS XProtect) — genuinely sufficient for most threat models | Same + Malwarebytes on-demand scans | Enterprise-grade EDR (e.g. CrowdStrike-class tooling scaled to personal use is usually overkill — better spent on the OS hardening line above) |
| Sensitive/high-risk browsing | — | Whonix or Tails on a spare USB for anything genuinely sensitive | Dedicated air-gapped machine for the highest-sensitivity work (e.g. cold storage key generation) |

---

## 4. Network & Infrastructure

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| VPN | Proton VPN free tier | Mullvad, IVPN, or Proton VPN paid (~$60–120/yr) | Same, plus a self-hosted WireGuard exit node on a rented VPS for full trust control |
| DNS | ISP default (fine for most threat models — see note below) | Encrypted DNS via Mullvad DNS or Quad9 | Self-hosted Pi-hole/AdGuard Home + upstream DoH, full control of resolution and logging |
| Router | Stock ISP firmware, admin password changed from default | OpenWrt or similar open firmware on a supported router | OPNsense/pfSense on dedicated hardware, VLAN-segmented network (IoT isolated from primary devices) |
| Browser | Firefox + uBlock Origin | Same, disciplined container/profile separation | Mullvad Browser for fingerprint-resistant sessions, Tor Browser for anonymity-grade needs |

**Note on DNS**: changing DNS provider alone is frequently oversold — your ISP can often still see traffic patterns via other means regardless. It's a real but secondary control, not a foundational one; don't let it eat budget that should go to Domain 1 or 2 first.

---

## 5. Communications

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Primary messaging | Signal (free) | Same, with disappearing messages + registration lock enforced org-wide (family/close contacts) | Same + SimpleX Chat for any relationship requiring zero persistent identifier |
| High-risk/activist-grade needs | — | — | Briar (peer-to-peer, mesh/Tor-capable) |
| Voice/video | Signal calls | Same + a free Google Voice number for anything lower-trust than your real number (marketplace listings, one-off signups) | Same + a dedicated burner number (Burner or Hushed, ~$5/mo) for anything requiring full compartmentalization from a real number |

---

## 6. Data Storage & Backup

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Cloud storage | Proton Drive free (5GB) or Filen free tier | Proton Drive (bundled) for sensitive/small data + Filen (~$90/yr for 2TB) for bulk<span class="verified-tag">✓ verified 2026-07-25</span><span class="legacy-note"><b>Legacy:</b> previously listed at ~$115/yr; corrected to ~$90/yr (Filen's actual current Pro III annual price) on 2026-07-25.</span> | Same, plus a self-hosted Nextcloud instance for full data ownership, encrypted offsite via Backblaze B2/Storj |
| Client-side encryption | Cryptomator desktop (free) for anything going to a non-zero-knowledge provider | Same + paid mobile app for read/write on the go (~$30 one-time) | Same + VeraCrypt containers for local-only high-sensitivity archives |
| Backup strategy | 3-2-1: local drive + one cloud copy | 3-2-1 fully implemented with Syncthing for the local-to-local leg | 3-2-1 + offline cold backup (encrypted drive in a fireproof safe or safe deposit box), quarterly restore-test verification |

---

## 7. Financial & Transactional

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Card masking | Bank's built-in virtual card feature if available (often free) | Privacy.com (free tier or ~$5–10/mo for advanced limits) | Dedicated per-vendor virtual cards on every recurring subscription, spend-limit automation |
| Credit monitoring | Free annual reports (annualcreditreport.com), free credit freezes at all 3 bureaus | Same + a paid monitoring service alert layer | Full identity theft insurance/restoration service (e.g. through an existing insurer or a dedicated provider) |
| Privacy-respecting payment | Cash for in-person where feasible | Same + Monero for the rare transaction requiring real privacy (not Bitcoin — pseudonymous, not private) | Same, with disciplined separation between the identity used for financial privacy tools and any public-facing identity |

---

## 8. OSINT & Digital Footprint

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Self-audit | Manual search of your own name/usernames/phone/address, Have I Been Pwned check — free, do this first regardless of tier | Same, quarterly instead of one-time | Same + a professional OSINT self-assessment modeled on Bazzell's "Extreme Privacy" workbook methodology |
| Data broker removal | Manual opt-outs via Bazzell's/EFF's free broker lists | EasyOptOuts ($19.99/yr) | EasyOptOuts + DeleteMe layered together, or Optery Ultimate for highest documented removal rate with screenshot verification |
| Username hygiene | Audit every handle for reuse across a public-facing identity and a personal one | Same, formalized: dedicated alias set per public identity | Same + periodic professional re-audit as public profile grows |

**This is the domain most people under-invest in relative to its actual leverage.** A perfect VPN setup doesn't matter if a handle you use publicly is one Google search away from your real name via a decade-old forum account.

### How people-search sites actually work

Sites like Spokeo, BeenVerified, Whitepages, MyLife, Radaris, PeekYou, Intelius, TruthFinder, and dozens of smaller ones are **data brokers**: they buy bulk records from public sources (voter files, property records, court filings) and commercial data feeds (marketing lists, app SDKs, loyalty programs), stitch them into a profile under your name, and sell access — either per-lookup or via subscription — to anyone who searches you. A handful of parent companies own many brands at once (PeopleConnect alone owns Intelius, TruthFinder, USSearch, and Instant Checkmate), so one company's data mistake or breach can propagate your listing across several "different" sites simultaneously.

Two things follow from that:

- **Opting out removes a listing, not the underlying record.** These sites re-scrape their sources on a cycle, so a removed profile can reappear weeks or months later — this is why "verified removed" is never a permanent state, only a snapshot, and why quarterly re-checking matters more than the initial opt-out itself.
- **Opting out at one broker doesn't touch the others.** There's no shared suppression list across companies (aside from the PeopleConnect-family exception above) — each site's opt-out only ever covers that site.

**DIY vs. paying someone else to do it**, concretely:

| | **Manual (free)** | **Paid automated** |
|---|---|---|
| What you're paying for | Nothing — your own time, repeated quarterly | Someone else re-submitting requests on a recurring schedule so you don't have to remember to |
| Coverage | As wide as the list you work from | Whatever that vendor covers — varies by vendor, check their published broker list |
| Documented effectiveness | N/A — depends on your own follow-through | Varies significantly by vendor; Consumer Reports' 2024 test found EasyOptOuts (65% removal) meaningfully outperformed DeleteMe (27%) despite costing far less — see the Recommendations Report for the full comparison |
| Best for | Anyone willing to spend ~1 hour/quarter | Anyone who has tried the manual route and knows they won't keep up with it, or who wants broader coverage than a free list provides |

**Use the <a href="../broker-removal-tracker/">Broker Removal Tracker</a>** to work through opt-out requests for the ~16 highest-traffic broker sites directly, with progress tracked locally in your browser. It links out to each site's own official opt-out page — never a third party claiming to submit it "for" you for free, which is itself a common scam pattern in this space.

---

## 9. Social Engineering & Human-Layer Defense

This is the domain with no dollar cost and the highest neglect rate — most breaches start here, not with a technical exploit.

| | **Budget / Mid / No-Limit — same controls at every tier, this domain is about discipline, not spend** |
|---|---|
| Phishing | Verify sender domain character-by-character before clicking; never act on urgency alone; confirm unusual requests (even from known contacts) through a second channel |
| Vishing (voice phishing) | Establish a family/close-contact verbal passphrase for any request involving money, credentials, or access — a scripted, calm hang-up-and-call-back-on-a-known-number habit defeats nearly all voice-based social engineering |
| Pretexting | Assume any unsolicited contact claiming to be a bank, government agency, or service provider is false until verified independently (call the number on the actual card/bill, not the number they give you) |
| Physical social engineering | Be skeptical of unsolicited technicians, deliveries, or "can I use your phone" requests; don't discuss travel plans or home-alone windows on public/social channels |
| Training the people around you | This only works if immediate family/close contacts are onboarded too — a hardened account with a socially-engineerable family member sharing your info is still exposed. If you're moving contacts to a more secure messenger, have the same "why" conversation about security basics, not just the app switch |

**No-limit add-on**: a professional social engineering penetration test (red-team engagement) against your own household — genuinely available as a service, mostly relevant if your public profile or net worth justifies it.

---

## 10. Physical Security

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Device physical security | Auto-lock timers set aggressively, Find My/anti-theft enabled | Cable locks for stationary equipment, privacy screens in public | Faraday bags for travel with sensitive devices, tamper-evident seals |
| Home | Standard door/window security, don't broadcast an empty-house schedule on social media | Smart locks/cameras on a segmented IoT VLAN (ties back to Domain 4) | Professional security assessment, monitored alarm system |
| Travel | Don't overshare real-time location; use offline maps where possible | Burner device or a wiped/minimal-data device for higher-risk travel | Dedicated travel-only hardware with no sensitive data ever synced to it |

---

## 11. Legal & Documentation

| | **Budget** | **Mid** | **No-Limit** |
|---|---|---|---|
| Credit freezes | Free at all 3 bureaus — do this regardless of tier | Same + calendar reminder to review annually | Same + monitoring service that auto-manages temporary lifts when needed |
| Digital legacy | A written, offline document listing account recovery info location for a trusted person, without exposing live credentials | Password manager's built-in emergency access feature (Bitwarden, Proton Pass support this) | Formal estate planning inclusion of digital assets with an attorney |
| Business/creator entity separation | Keep personal and content-creator/business accounts distinct (ties to Domain 8) | Consider an LLC or equivalent once that work starts generating real revenue, for liability and identity separation | Full legal review of content/IP exposure as revenue grows |

---

## 12. Maintenance Cadence

The domain that turns this from a project into a program:

| Frequency | Action |
|---|---|
| Weekly | Patch/update check across OS, browser, apps (mostly automatic, spot-check) |
| Monthly | Review recent account activity/login alerts on email, financial accounts |
| Quarterly | Re-run OSINT self-audit; review app permissions on mobile; verify backups actually restore |
| Semi-annually | Revisit the Threat Model (Section 0) — has anything about your exposure changed? |
| Annually | Full credential rotation review; re-evaluate every tool in this document against current Privacy Guides/Consumer Reports data — this space moves fast enough that a stale list is a liability |

---

## Incident Response Runbooks

Adapted from the Preparation → Detection → Containment → Eradication → Recovery → Lessons-Learned structure used in professional security operations.

### Runbook A: Suspected Credential Compromise (phishing click, password reuse breach, suspicious login alert)

1. **Detect**: Login alert from an unfamiliar location/device, password manager breach-monitor flag, or you clicked something you shouldn't have.
2. **Contain (first 15 minutes)**: Change the password on the affected account immediately from a known-clean device. If it's your email, do this first, before anything else — email is the recovery path for everything else.
3. **Eradicate**: Revoke all active sessions/devices on the account. Check and remove any unfamiliar forwarding rules, recovery emails, or connected apps that may have been added.
4. **Recover**: Re-enable 2FA/hardware key if it was somehow removed. Check every account that uses this one for password recovery — assume lateral compromise until verified otherwise.
5. **Lessons learned**: Was the password unique? If not, that's the actual root cause — fix the password manager gap, not just this one account.

### Runbook B: Lost or Stolen Device

1. **Detect**: You know immediately.
2. **Contain**: Trigger remote lock/wipe (Find My, Android Find My Device) within minutes. Change the passwords for any accounts that were logged in and not behind a separate app lock.
3. **Eradicate**: Revoke that device's sessions from your password manager and any service with "manage devices" (Signal, Proton, etc.).
4. **Recover**: Restore to a new device from your encrypted backup (Domain 6 — this is why the 3-2-1 exists).
5. **Lessons learned**: Was full-disk encryption on? If not, treat this as a full breach of everything on the device, not just a hardware loss.

### Runbook C: SIM Swap Attempt or Detected

1. **Detect**: Sudden loss of cell service, unexpected "your SIM has been updated" notification, or 2FA codes stop arriving via SMS.
2. **Contain**: Call your carrier immediately using a second phone/line; request an immediate freeze on the account and SIM.
3. **Eradicate**: Change passwords on any account that had SMS-based 2FA, in order of sensitivity (email/financial first). This is the strongest argument in the entire document for hardware keys/TOTP over SMS 2FA — SMS is the attack vector, not the defense.
4. **Recover**: Set a carrier PIN/passcode requirement for any future SIM changes.
5. **Lessons learned**: Audit every account still using SMS 2FA and migrate it.

### Runbook D: Doxxing / Personal Info Exposed Publicly

1. **Detect**: You find (or someone alerts you to) your real name, address, or other PII posted publicly and tied to an identity you meant to keep separate.
2. **Contain**: Document everything (screenshots, URLs, timestamps) before it can be edited or deleted — you'll need this for platform reports and potentially law enforcement. Do not engage publicly.
3. **Eradicate**: File takedown/report requests with the hosting platform. If it's on a data broker/people-search site, expedite manual opt-out rather than waiting for the automated service's next cycle.
4. **Recover**: Assess whether physical safety is a concern; if so, this escalates beyond a document like this — involve law enforcement and consider a temporary change in routine.
5. **Lessons learned**: Trace back how the link was made (username reuse is the most common cause) and close that specific gap — this is exactly what Domain 8's username audit is meant to prevent.

### Runbook E: Suspected Malware Infection

1. **Detect**: Unusual battery drain, unexpected pop-ups, programs you didn't install, antivirus alert.
2. **Contain**: Disconnect from the network immediately (kills most exfiltration and C2 communication).
3. **Eradicate**: Boot from a clean external OS/rescue media to scan, or in the worst case, wipe and reinstall from a known-clean backup. Don't trust the infected OS to clean itself.
4. **Recover**: Restore data from backup, change every password that was ever entered on that device, treated as potentially compromised.
5. **Lessons learned**: How did it get in? Tighten that specific vector (email attachment discipline, browser extension audit, download source hygiene).

### Runbook F: Social Engineering Attempt (impersonation call, pretexting, vishing)

1. **Detect**: A call/message creating urgency around money, credentials, or access, especially claiming to be someone you know or a trusted institution.
2. **Contain**: Do not act during the call. Hang up. Do not use any callback number they provided.
3. **Verify**: Call back using a number you already had on file, or the family passphrase system from Domain 9.
4. **Recover**: If any information was given before you caught it, treat it like Runbook A/D depending on what was disclosed.
5. **Lessons learned**: Share the specific pretext used with anyone else who might be targeted the same way (family, close contacts) — social engineers often run the same script against multiple people in a network.

### Runbook G: Financial Fraud / Unauthorized Transaction

1. **Detect**: An unrecognized charge, a bank/card fraud alert, a new account or credit inquiry you didn't initiate, or money missing that you didn't move.
2. **Contain (first 15 minutes)**: Call the fraud line on the back of your card or your bank's official number — not a number from a text or email claiming to be them. Freeze the specific card/account if the institution supports instant in-app freezing; this is faster than waiting on hold and doesn't require explaining anything yet.
3. **Eradicate**: Dispute the specific transaction(s) formally, in writing where the institution allows it, not just verbally. If a new account or credit line was opened in your name, that's identity theft, not just card fraud — file a report at [identitytheft.gov](https://www.identitytheft.gov) (the FTC's official recovery process) in addition to the bank dispute.
4. **Recover**: If a credit freeze wasn't already in place at all three bureaus (Domain 7/11), put one on now to block further new-account fraud while the dispute is investigated. Rotate the password on the affected account and any account that shares a password with it.
5. **Lessons learned**: Trace how the exposure likely happened — card skimmed, merchant breach, phished, or a data-broker-listed detail used for account takeover — and close that specific gap. This is exactly why the incident-contact list from the OPSEC Field Manual's Legal & Documentation domain (bank fraud line, carrier fraud line, non-emergency police line, written down *before* you need it) is worth having ready rather than searched for mid-incident.

---

## Closing note on tier selection

The right answer for most people isn't "max out every row." It's: fully saturate Domains 1, 2, 8, and 9 (identity foundation, hardware auth, OSINT hygiene, social engineering discipline) at whatever tier you can sustain — these are the highest-leverage, and largely free or near-free — before spending real money climbing the tiers in Domains 3–7. A No-Limit VPN and a Budget password manager is a worse security posture than the reverse.

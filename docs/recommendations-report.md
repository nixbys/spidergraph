# Recommendations Report
### Synthesized from the Personal Security Playbook, Stack Builder, and OPSEC Field Manual

This is the capstone document — it pulls the highly-recommended picks and best-practice guidance out of the other three files into one report, and documents exactly where every claim in this project came from. Both interactive tools (`privacy-stack-builder.html` and `opsec-field-manual.html`) now also have a **Generate Report** button that exports a version of this same report reflecting your actual live selections — this document is the reference version; theirs is the personalized one.

---

## Part 1: Highly Recommended Stack — Top Pick Per Category

If you only take one thing from each category, take this. These are the picks that showed up as the strongest option across independent testing, audits, or documented track record, not just the most expensive.

| Category | Highly recommended | Why this one specifically |
|---|---|---|
| Password manager | **Bitwarden Premium** or **Proton Pass** | Open source (Bitwarden), independently audited, cross-platform, hardware-key lockable |
| Email + aliasing | **Proton Unlimited** | Bundles Mail, aliasing (SimpleLogin Premium), Drive, VPN, Calendar under one zero-knowledge provider — best per-dollar coverage if you're not diversifying on purpose |
| Hardware 2FA | **2x YubiKeys** (primary + offsite backup) | Phishing-resistant in a way TOTP codes structurally can't be; the second key solves the lockout failure mode the first one creates |
| Desktop OS | **Fedora Atomic (Silverblue/Kinoite)**, or **Secureblue** for a hardened fork | Immutable/atomic model limits persistence of malware and config drift by design |
| Mobile OS | **GrapheneOS** (Android path) or **iOS Lockdown Mode** as standing default | De-Googled hardened AOSP with real sandboxing; Lockdown Mode is the practical ceiling if staying on Apple hardware |
| VPN | **Mullvad** or **Proton VPN** | No-logs, privacy-preserving payment options (Mullvad takes cash/Monero, no email required), WireGuard support |
| Browser | **Firefox + uBlock Origin** | Highest value-per-minute-of-setup control in the entire stack; **Mullvad Browser** as the upgrade when fingerprinting resistance matters more than convenience |
| Messaging | **Signal** | Free, minimal metadata collection, easiest adoption curve for non-technical contacts; **SimpleX Chat** as the ceiling for zero-persistent-identifier needs |
| Cloud storage | **Proton Drive** (sensitive/small) + **Filen** or **Cryptomator + Backblaze B2** (bulk media) | Splits by data sensitivity rather than forcing everything into one provider's pricing tier |
| Data broker removal | **EasyOptOuts** ($19.99/yr) | Outperformed DeleteMe on actual documented removal rate in Consumer Reports' 2024 test (65% vs. 27%) despite costing a fraction as much; layer in DeleteMe or Optery only if phone/fax-gated brokers matter to your exposure |
| DNS/Router | **OpenWrt** + encrypted DNS (Mullvad DNS/Quad9) | Router firmware is the higher-leverage control; DNS provider alone is commonly oversold |
| Backup | **3-2-1** (local + Syncthing local sync + encrypted offsite) | The structure matters more than any single product choice inside it |

---

## Part 2: Best Practices & Techniques — Closing the Gap to 100%

Organized to match the OPSEC Field Manual's six domains. If a domain isn't at 100%, this is the "how," not just the "what."

### Social Engineering & Human-Layer Defense
- **Build the callback habit physically, not just mentally**: save your bank's, carrier's, and any financial institution's real number in your phone under a clearly labeled contact now, before you need it under pressure. The failure mode isn't not knowing you should verify — it's not having the real number on hand in the moment.
- **Run the family passphrase conversation as a specific scenario, not an abstract rule**: "if someone calls claiming to be me asking for money or a code, ask them [passphrase]" is concrete and memorable; "be careful of scams" is not.
- **Treat security questions as a second password field**: generate random answers and store them in your password manager rather than answering truthfully — "mother's maiden name" is frequently public-record discoverable.

### Physical Security
- **Verify encryption, don't assume it**: on Linux, `lsblk -f` should show `crypto_LUKS`; on iOS/Android it's on by default with a passcode set but confirm in Settings; on Windows/Mac check BitLocker/FileVault status directly rather than trusting a memory of having enabled it once.
- **Actually test the remote wipe**: log into Find My / Find My Device from another device and confirm you can see and act on your own hardware right now, not just that the toggle is on.
- **Segment IoT at the router, not the app level**: a guest network SSID with client isolation enabled is the low-effort version of VLAN segmentation and covers most of the real risk.

### Legal & Documentation
- **Freeze, don't just monitor, credit**: monitoring tells you after something happened; a freeze (free, all three bureaus) prevents new accounts from opening at all. Do this even if you also pay for monitoring.
- **Use your password manager's built-in emergency access feature** rather than writing down actual passwords anywhere — Bitwarden and Proton Pass both support a trusted-contact request-and-wait-period model that gives access without exposing live credentials today.
- **Separate business and personal at the account level before revenue makes it complicated**, not after — a dedicated email alias and, once revenue justifies it, a separate legal entity.

### Operational Discipline
- **Strip metadata as a default habit, not a special step**: run new photos through MAT2 or ExifTool before they leave your device, or set your camera app to disable location tagging entirely so there's nothing to strip later.
- **The username audit is the single highest-leverage item in this whole domain**: search every handle you use for your public-facing identity against every other account you've ever created with it. One shared username is enough to collapse years of compartmentalization.
- **Quarterly app permission review**: on iOS, Settings → Privacy & Security walks every permission category by app; block anything you can't justify in one sentence.

### Incident Response Readiness
- **Write your own 15-minute runbook now, don't rely on remembering the playbook doc under stress**: three lines — "1) change password from clean device, 2) revoke all sessions, 3) check recovery email/phone for tampering" — taped somewhere or saved as a pinned note is more useful mid-incident than a comprehensive document you have to search through.
- **Actually restore a file from backup today**, not "confirm the backup ran." A backup that's never been restored is a hypothesis, not a safety net.
- **Know each platform's specific report-abuse flow before you need it** — Meta, X, and Reddit all have different doxxing/impersonation reporting paths; bookmark them.

### Maintenance & Audit Cadence
- **Anchor the quarterly OSINT self-audit to a recurring calendar date you already have** (e.g., the same week as a bill or subscription renewal) rather than an arbitrary "every 3 months" that quietly slips.
- **Treat the annual credential rotation as a checklist, not a vibe**: export a list of every account your password manager tracks, sort by last-changed date, and rotate anything over a year old, prioritizing the ones tied to financial or identity recovery.

---

## Part 3: Sources This Report Draws On

### Primary methodology sources (the four requested at the start of this project)
- **Privacy Guides** — [privacyguides.org](https://www.privacyguides.org) — tool recommendations and comparison criteria; most frequently updated of the four, treated as source of truth for "which product"
- **The New Oil** — [thenewoil.org](https://thenewoil.org) — sequencing/tiering philosophy (Most/Moderately/Less Important framing adapted into this project's Budget/Mid/No-Limit tiers)
- **IntelTechniques (Michael Bazzell)** — [inteltechniques.com](https://inteltechniques.com) — OSINT self-audit methodology, the "Extreme Privacy" workbook approach behind the OSINT/username-reuse guidance throughout this project
- **Techlore** (YouTube) — implementation walkthroughs referenced for setup steps (GrapheneOS installs, Tor Browser configuration, and similar hands-on processes)

### Independent testing and journalism used for specific claims
- **Consumer Reports** (2024 data broker removal effectiveness study, via Yael Grauer's methodology) — source for the EasyOptOuts (65%) vs. DeleteMe (27%) removal-rate comparison
- **TechRadar** — DeleteMe pricing verification
- **Cape.co, PrivacyOn** — secondary analysis of the Consumer Reports data broker findings
- **The Hacker News, TechTimes** — Firefox 152.0.6 critical CVE / public exploit code reporting (MFSA 2026-67)
- **9to5Linux, OMG Ubuntu, Linuxiac, Starry Hope, Baizaar** — Proton Drive Linux client status and Cryptomator platform-support verification

### Official vendor documentation (pricing, feature, and platform-support claims)
- **Proton** (proton.me, official blog, pricing pages, community UserVoice forum) — Unlimited plan pricing/bundling, hardware key 2FA behavior, Drive Linux roadmap
- **Cryptomator** (cryptomator.org) — licensing model, platform availability, technical architecture (AES-256-SIV, zero-knowledge design)
- **Filen, Backblaze, Mullvad, Bitwarden, Signal, EasyOptOuts** — official pricing and feature pages for each respective tool

### Referenced but not directly cited
- **Electronic Frontier Foundation (EFF) Surveillance Self-Defense** — referenced in Cryptomator source material as the standard justification for client-side encryption; worth reading directly (see Part 4)

---

## Part 4: Recommended Sources to Keep Building From

The tools above will be stale within a year — this space moves fast. These are the sources worth following on an ongoing basis rather than just consulting once.

| Source | Best for | Cadence |
|---|---|---|
| **Privacy Guides** (site + forum + blog) | Living, versioned tool recommendations — check before any purchase decision, not just once | As-needed, before any purchase |
| **The New Oil** | Sequencing/prioritization when you're adding a new domain to your setup you haven't tackled yet | As-needed |
| **IntelTechniques podcast + workbook updates** (Bazzell) | OSINT methodology evolution — data broker landscape changes constantly | Quarterly check-in |
| **Techlore** (YouTube + Discord) | Hands-on setup walkthroughs, especially for anything with a fiddly install process | As-needed |
| **EFF Surveillance Self-Defense** ([ssd.eff.org](https://ssd.eff.org)) | Foundational threat-modeling framework and guides that don't chase every product trend | Read once in full, revisit the threat-modeling section every 6 months |
| **Consumer Reports Security Planner / digital security coverage** | Independent, non-affiliate-driven testing — the source that actually caught the DeleteMe vs. EasyOptOuts gap | Annual, around when you reconsider any paid subscription |
| **Have I Been Pwned** ([haveibeenpwned.com](https://haveibeenpwned.com)) | Breach monitoring — set up email alerts once, it notifies you going forward | Passive/ongoing once configured |
| **ToS;DR** ([tosdr.org](https://tosdr.org)) | Quick terms-of-service/privacy-policy ratings before signing up for anything new | As-needed, before new signups |
| **Krebs on Security** | General infosec news with a track record of being first and accurate on major breaches | As-needed / breaking news |
| **r/privacy, r/degoogle** | Community discussion — useful for surfacing questions to research further, not as a primary source on its own; verify anything specific against one of the sources above | Optional, treat critically |

**One habit worth adopting from this list specifically**: before renewing or newly subscribing to *any* paid privacy/security tool, check Privacy Guides and Consumer Reports first — both this project's own EasyOptOuts/DeleteMe comparison and the Firefox critical-patch update earlier in this conversation only happened because those sources get checked at the point of decision rather than relied on from memory.

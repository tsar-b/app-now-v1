# DNS And Network Playbook

This guide explains the repeated GitHub/npm "DNS" nuisance seen on the ASUS and
Mac workflows.

## Short Diagnosis

The issue we observed is mostly not DNS.

On ASUS:

- `Resolve-DnsName github.com` succeeded.
- `Resolve-DnsName registry.npmjs.org` succeeded.
- A sandboxed GitHub connection failed.
- The same GitHub operation worked after Codex network approval.
- An approved TCP check to `github.com:443` and `registry.npmjs.org:443`
  succeeded.

So the usual cause is:

```txt
Codex sandbox/network policy blocks network egress until approved.
```

It looks like DNS because Git/npm often report "could not connect" or "could
not resolve" in a generic way. But if browser access works and approved Codex
commands work, the laptop network is probably fine.

## How To Tell DNS From Sandbox

Run these on Windows PowerShell:

```powershell
Resolve-DnsName github.com
Resolve-DnsName registry.npmjs.org
Test-NetConnection github.com -Port 443
Test-NetConnection registry.npmjs.org -Port 443
```

Interpretation:

| Result | Meaning |
| --- | --- |
| DNS fails | Real DNS issue. Fix router/VPN/DNS settings. |
| DNS succeeds but TCP 443 fails everywhere | Firewall, VPN, router, ISP, or security software. |
| Browser works but Codex git/npm fails | Codex sandbox permission/network policy. |
| Codex works after approval | Not DNS. It was network approval. |

## Codex-Specific Fix

When a network command fails in Codex:

1. Rerun the exact command with approval.
2. Use narrow approved prefixes for repeat work:

```txt
git clone
git fetch
git push
npm install
npm run build
npm audit
```

Do not diagnose router DNS first if the same command works after approval.

## Windows ASUS Checklist

Use this when browser or approved commands also fail.

### 1. Flush DNS

```powershell
ipconfig /flushdns
```

### 2. Reset Winsock

Run in elevated PowerShell:

```powershell
netsh winsock reset
```

Restart Windows after this.

### 3. Check DNS Servers

```powershell
Get-DnsClientServerAddress
```

Known stable options:

```txt
Cloudflare: 1.1.1.1, 1.0.0.1
Google:     8.8.8.8, 8.8.4.4
Quad9:      9.9.9.9, 149.112.112.112
```

### 4. Check IPv6 Weirdness

If GitHub/npm are flaky only on one network, IPv6 may be misrouted.

Temporary test:

```powershell
Test-NetConnection github.com -Port 443
Test-NetConnection registry.npmjs.org -Port 443
```

If DNS returns IPv6 first and TCP fails, prefer a known-good DNS provider or
temporarily disable IPv6 on that adapter for testing.

### 5. Check Proxy

```powershell
netsh winhttp show proxy
npm config get proxy
npm config get https-proxy
git config --global --get http.proxy
git config --global --get https.proxy
```

Unset stale proxies:

```powershell
npm config delete proxy
npm config delete https-proxy
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 6. Check Security Software

If only GitHub/npm are blocked:

- Windows Defender controlled folder access
- third-party antivirus HTTPS inspection
- corporate VPN
- Cloudflare WARP
- router parental/security DNS

Temporarily disable one layer at a time for testing.

## macOS Checklist

### 1. Flush DNS

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### 2. Check DNS

```bash
scutil --dns
dig github.com
dig registry.npmjs.org
```

### 3. Check Connectivity

```bash
nc -vz github.com 443
nc -vz registry.npmjs.org 443
```

### 4. Check Proxy

```bash
env | grep -i proxy
npm config get proxy
npm config get https-proxy
git config --global --get http.proxy
git config --global --get https.proxy
```

### 5. Check Apple Network Layers

Disable temporarily for testing:

- iCloud Private Relay
- VPN
- security DNS profile
- Little Snitch / LuLu / firewall rules

## Router-Level Fix

If both laptops fail outside Codex:

1. Reboot router.
2. Set router DNS to Cloudflare or Google.
3. Disable router "safe browsing", "AI security", or parental DNS for testing.
4. Test on phone hotspot.

If hotspot works but home Wi-Fi fails, the problem is router/ISP/DNS.

## GitHub-Specific Notes

GitHub can resolve to different IPs by region. Sometimes one edge IP is flaky.

Good tests:

```powershell
Resolve-DnsName github.com
Test-NetConnection github.com -Port 443
git ls-remote https://github.com/tsar-b/app-now-v1.git
```

If `git ls-remote` works after Codex approval, stop debugging DNS.

## AppNow Team Rule

When Mac and ASUS both work on AppNow:

- Use separate branches.
- Expect Codex network commands to need approval.
- Do not call it DNS unless `Resolve-DnsName` or `dig` fails.
- If browser works and Codex fails, approve the command or adjust Codex network
  policy.

This keeps us from wasting 40 minutes fighting imaginary router spirits.

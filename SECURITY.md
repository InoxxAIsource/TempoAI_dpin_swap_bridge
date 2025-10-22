# Security Policy

## Overview

Tempo DePIN is a decentralized physical infrastructure network (DePIN) platform that enables users to earn rewards, bridge assets across chains using Wormhole, and access DeFi opportunities. Security is our top priority.

## Supported Versions

| Version | Supported          | Network |
| ------- | ------------------ | ------- |
| V2      | :white_check_mark: | Sepolia Testnet |
| V1      | :x:                | Deprecated |

**Current Deployment:**
- Contract: `TempoDePINFaucet_V2`
- Address: `0x7c5ab398a5fce2726534dee1617d7e629b96970a`
- Network: Sepolia (Testnet)
- Status: ✅ Verified on Etherscan

## Security Architecture

### Smart Contracts
- **TempoDePINFaucet_V2**: Reward distribution contract with batch claiming and multi-claim support
- **Security Features**:
  - Owner-only reward allocation
  - Claim ID deduplication prevention
  - Emergency withdrawal capability
  - Ownership transfer mechanism

### Backend Security
- Supabase Row-Level Security (RLS) policies on all user tables
- JWT-based authentication via Supabase Auth
- Wallet signature verification for EVM wallet linking
- Server-side validation in Edge Functions

### Frontend Security
- Input validation using Zod schemas
- XSS prevention (no dangerouslySetInnerHTML)
- HTTPS-only communication
- Secure wallet connection via RainbowKit/Web3Auth

## Reporting a Vulnerability

### Scope
We accept vulnerability reports for:
- Smart contract vulnerabilities (reentrancy, access control, arithmetic)
- Authentication/authorization bypass
- SQL injection in Edge Functions
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Wallet signature verification bypass
- Bridge transaction manipulation
- Reward calculation errors

### Out of Scope
- Issues in third-party dependencies (report to maintainers)
- Social engineering attacks
- DDoS attacks
- UI/UX issues without security impact
- Best practice violations without exploitable impact

### Reporting Process

**For Critical/High Severity Issues:**
1. **DO NOT** open a public GitHub issue
2. Email: security@tempoDepin.com (if available) or use GitHub Security Advisories
3. Include:
   - Vulnerability description
   - Steps to reproduce
   - Proof of concept (if applicable)
   - Suggested fix (optional)
   - Your contact information

**For Medium/Low Severity Issues:**
- Open a GitHub issue with label `security`
- Provide detailed description and reproduction steps

### Response Timeline
- **Critical**: Response within 24 hours, patch within 7 days
- **High**: Response within 48 hours, patch within 14 days
- **Medium**: Response within 5 days, patch within 30 days
- **Low**: Response within 7 days, patch within 60 days

## Vulnerability Disclosure Policy

### Coordinated Disclosure
We follow a coordinated disclosure process:
1. Report received and acknowledged
2. Vulnerability validated and severity assessed
3. Fix developed and tested
4. Security advisory published (after fix deployed)
5. Reporter credited (if desired)

### Public Disclosure Timeline
- We aim to publicly disclose vulnerabilities within **90 days** of initial report
- Earlier disclosure may occur if:
  - Fix is deployed and verified
  - Reporter agrees to earlier disclosure
  - Vulnerability is being actively exploited

## Known Limitations

### Testnet Status
⚠️ **Current deployment is on Sepolia TESTNET only**
- Not production-ready
- Test ETH has no real value
- Smart contracts not audited by third parties

### Bridge Dependencies
- Relies on Wormhole bridge security
- Guardian network availability required
- Cross-chain transaction delays possible

### Rate Limiting
- Claim frequency limits enforced
- Auto-funding disabled in production mode
- Manual contract funding required for large claims

## Bug Bounty Program

### Status
🚧 **Coming Soon** - Bug bounty program will be launched before mainnet deployment

### Anticipated Rewards
| Severity | Reward Range |
| -------- | ------------ |
| Critical | $5,000 - $50,000 |
| High     | $2,000 - $10,000 |
| Medium   | $500 - $2,000 |
| Low      | $100 - $500 |

*Final rewards will be determined based on impact, quality of report, and fix complexity.*

## Security Measures

### Access Control
- Multi-signature wallet recommended for production ownership
- Time-locked administrative actions
- Role-based access in backend (admin, user roles separated)

### Monitoring
- Real-time transaction monitoring
- Failed claim attempt tracking
- Anomaly detection for unusual reward patterns
- VAA polling for bridge transactions

### Auditing
- All administrative actions logged
- Blockchain transaction history immutable
- Database change tracking enabled

## Pre-Deployment Checklist

Before mainnet deployment, ensure:
- [ ] Third-party smart contract audit completed
- [ ] Penetration testing performed
- [ ] RLS policies reviewed and tested
- [ ] Rate limiting implemented
- [ ] Emergency pause mechanism tested
- [ ] Incident response plan documented
- [ ] Multi-sig wallet configured
- [ ] Bug bounty program launched
- [ ] Insurance coverage obtained (optional)

## Contact

- **Security Email**: security@tempoDepin.com (setup pending)
- **GitHub Security**: Use "Security" tab → "Report a vulnerability"
- **Discord**: [Community Server] (for general security questions only)

## Acknowledgments

We thank the security researchers and community members who help keep Tempo DePIN secure. Responsible disclosure contributors will be recognized in our Hall of Fame.

---

**Last Updated**: 2025-10-22  
**Version**: 1.0

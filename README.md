# Clinic Marketing Agency - Multi-Agent Management System

Welcome to the **Clinic Marketing Agency** repository. This project is structured to manage marketing content and strategy for two distinct medical divisions using a Multi-Agent AI system.

## 🏥 Agency Structure

The agency is divided into two specialized branches:

- **00_Compliance**: Houses all regulatory and ethical standards (e.g., Greek Dental Association guidelines) that all content must adhere to.
- **01_Surgical_Division**: Focuses on clinical authority, surgical procedures, and high-trust medical content.
- **02_Cosmetic_Division**: Focuses on aesthetic luxury, patient lifestyle, and visual engagement.

## 🤖 AI Agent Roles

We utilize specialized agent personas to ensure brand consistency and regulatory compliance:

- **Clinic Manager (`.agents/rules/manager.md`)**: Responsible for strategic oversight, workflow routing, and final compliance checks (GDPR/Medical Advertising).
- **Copywriter (`.agents/rules/copywriter.md`)**: Responsible for drafting channel-specific content (Instagram, Google Business Profile) while adhering to division-specific brand identities.

## 📜 Governance & Rules

Global and division-specific rules are located in the `.agents/rules/` directories:

- **Global Rules**: Located at `.agents/rules/global_rules.md`.
- **Division Rules**: Each division has its own `brand_identity.md` within its `.agents/rules/` folder to ensure tone and topical accuracy.

## 📁 Content Library

Drafts and final assets are stored within the `Content_Library` of each division. All drafts must be reviewed by the `Clinic Manager` before publication.

---

### Compliance Note
*All content must adhere to GDPR standards. No Patient Identifiable Information (PII) should be stored in this repository or used in AI prompts.*

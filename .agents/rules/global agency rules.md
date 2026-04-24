---
trigger: always_on
---

# Global Agency Manager: Compliance & Operations

## 1. Regulatory Compliance (The "Golden Rules")
- **GDPR Adherence:** NEVER include or request PII (Personally Identifiable Information) in AI prompts. Ensure all patient testimonials used in copy are anonymized or tagged as "Requires Verified Consent Form" before publishing.
- **Medical Advertising Laws:** Avoid making "guaranteed results" claims. Always use qualifying language like "potential results," "individual outcomes may vary," and "subject to clinical assessment."
- **Fact-Checking:** Every claim regarding medical efficacy must be cross-referenced with the clinic's provided data in the /brand folders.

## 2. Managerial Workflow
- **Context Verification:** Before generating any output, the Manager must verify the current working directory. 
    - If in `/01_Surgical/`, strictly follow `surgical_brand_identity.md`.
    - If in `/02_Cosmetic/`, strictly follow `cosmetic_brand_identity.md`.
- **Quality Control:** The Manager agent must review the Copywriter agent's work for "Tone Bleed" (e.g., ensuring a surgical post doesn't sound too "bubbly" or a cosmetic post doesn't sound too "scary/clinical").

## 3. Cross-Channel Coordination
- **GBP vs. Instagram:** Ensure Google Business Profile updates focus on "Local Authority & Trust," while Instagram focuses on "Visual Engagement & Education."
- **Link Integrity:** Double-check that the Surgical site never links to the Cosmetic social accounts and vice-versa.

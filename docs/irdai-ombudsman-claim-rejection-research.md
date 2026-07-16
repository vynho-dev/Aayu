# IRDAI / Ombudsman Research For Rejected Insurance Claims

Date: 2026-07-16

## PRD Context

Aayu's MVP is focused on helping Indian families fight wrongly rejected health-insurance claims. The MVP flow requires the user to upload a rejection letter, policy document, bills, and discharge summary; the AI then generates a clause-cited appeal letter and policy explanation.

Important scope note: the PRD marks "IRDAI Ombudsman escalation workflow" as future scope. For MVP, these documents should be used to ground the denial assessment, appeal-letter generation, and user education. The product should avoid presenting itself as legal practice or regulated insurance advice.

## Core Official Documents / Sources

1. IRDAI - Master Circular on Protection of Policyholders' Interests, 2024
   - URL: https://irdai.gov.in/documents/37343/365525/%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8%E0%A5%80%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A5%8B%E0%A4%82%2B%E0%A4%95%E0%A5%87%2B%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8B%E0%A4%82%2B%E0%A4%95%E0%A5%87%2B%E0%A4%B8%E0%A4%82%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3%2B%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%82%E0%A4%A7%E0%A5%80%2B%E0%A4%AE%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A4%B0%2B%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%B0%2C%2B2024%2B_%2BMaster%2BCircular%2Bon%2BProtection%2Bof%2BPolicyholders%27%2Binterests%2B2024.pdf/2bc6a186-5c96-461b-2946-89945b9d488c?download=true&t=1737118636654&version=5.1
   - Why it matters: primary source for policyholder rights, insurer obligations, grievance redressal, claim servicing, customer information, policy documents, and timelines.
   - Product use: cite this when explaining user rights, insurer obligations, grievance flow, and why a rejection may deserve re-examination.

2. IRDAI - Grievance Cell / PPGR FAQ
   - URL: https://irdai.gov.in/grievance-cell-cad
   - Why it matters: explains first complaining to the insurer, escalation to IRDAI/Bima Bharosa, two-week insurer grievance response expectation, IRDAI complaint channels, and the path to Ombudsman/legal authority if unresolved.
   - Product use: create an escalation checklist and user-facing education copy.

3. IRDAI - Policyholders Protection and Grievance Redressal Department Functions
   - URL: https://irdai.gov.in/functions
   - Why it matters: explains that IRDAI facilitates re-examination with the insurer, lists Bima Bharosa/IGCC/email/phone/post channels, and says third-party complaints are not entertained.
   - Product use: ensure Aayu frames itself as assisting the insured/claimant to prepare materials, not filing as an unrelated third party.

4. IRDAI - Complaint Registration Form
   - URL: https://irdai.gov.in/documents/37343/620662/policyholder%2Bcomplaints%2Bregistration%2Bform29092021.pdf/5ff5e0af-a34e-6cba-91d2-fe053b076624?t=1633587167192
   - Why it matters: fields needed to structure a complaint file.
   - Product use: map extracted claim data into a future complaint packet.

5. IRDAI - Ombudsman page
   - URL: https://irdai.gov.in/ombudsman
   - Why it matters: official IRDAI page linking to CIO FAQs, contact details, awards, and rules.
   - Product use: source of truth for where to direct users after insurer/IRDAI escalation.

6. CIO - Council for Insurance Ombudsmen home and complaint flow
   - URL: https://www.cioins.co.in/
   - Why it matters: states complaint modes, prerequisite of first complaining to insurer/broker, one-month response threshold, one-year filing limit, and Rs. 50 lakh compensation limit.
   - Product use: future Ombudsman eligibility check.

7. CIO - Insurance Ombudsman Rules, 2017, as amended till 09.11.2023
   - URL: https://www.cioins.co.in/notification/Insurance%20Ombudsman%20Rules%2C%202017%28%20as%20amended%20till%2009.11.2023%29.pdf
   - Why it matters: legal operating rules for Ombudsman complaints.
   - Product use: jurisdiction, maintainability checks, filing prerequisites, relief limits, and evidence requirements.

8. CIO - Insurance Ombudsman (Amendment) Rules, 2023
   - URL: https://www.cioins.co.in/notification/Insurance%20Ombudsman%28Amendment%29%20Rules%2C%202023.pdf
   - Why it matters: latest amendment package available on CIO rules page.
   - Product use: keep future escalation logic aligned with amended rules.

9. CIO - Specimen Complaint Form
   - URL: https://www.cioins.co.in/speciemen/Specimen%20complaint%20form.docx
   - Why it matters: practical structure for Ombudsman complaint drafting.
   - Product use: future complaint-draft template.

10. CIO - Ombudsman office contacts and jurisdictions
    - URL: https://www.cioins.co.in/Ombudsman
    - Why it matters: routes complaint to the correct Ombudsman office based on jurisdiction.
    - Product use: jurisdiction picker after user enters insurer office/user residence.

11. IRDAI - Guidelines on providing AYUSH coverage in Health Insurance policies
    - URL: https://irdai.gov.in/documents/37343/365525/%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A5%8D%E0%A4%AF%2B%E0%A4%AC%E0%A5%80%E0%A4%AE%E0%A4%BE%2B%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2B%E0%A4%AE%E0%A5%87%E0%A4%82%2B%E0%A4%86%E0%A4%AF%E0%A5%81%E0%A4%B7%2B%E0%A4%95%E0%A4%B5%E0%A4%B0%E0%A5%87%E0%A4%9C%2B%E0%A4%A6%E0%A5%87%E0%A4%A8%E0%A5%87%2B%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%82%E0%A4%A7%E0%A5%80%2B%E0%A4%A6%E0%A4%BF%E0%A4%B6%E0%A4%BE%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%A6%E0%A5%87%E0%A4%B6%2B_%2BGuidelines%2Bon%2Bproviding%2BAYUSH%2Bcoverage%2Bin%2BHealth%2BInsurance%2Bpolicies.pdf/4448d993-ba0e-8622-fb8b-d82e9a3b5428?download=true&t=1707291608950&version=2.0
    - Why it matters: useful for claim rejections involving AYUSH treatment exclusions/limits.
    - Product use: add as a domain-specific rule in rejection analysis.

12. IRDAI - Modification in Product for Persons with Disabilities, HIV/AIDS, and Mental Illness
    - URL: https://irdai.gov.in/documents/37343/365525/%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A5%8B%E0%A4%97%E0%A5%8D%E0%A4%AF%E0%A4%A4%E0%A4%BE%E0%A4%93%E0%A4%82%2B%E0%A4%B8%E0%A5%87%2B%E0%A4%AF%E0%A5%81%E0%A4%95%E0%A5%8D%E0%A4%A4%2B%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2B%28%E0%A4%AA%E0%A5%80%E0%A4%A1%E0%A4%AC%E0%A5%8D%E0%A4%B2%E0%A5%8D%E0%A4%AF%E0%A5%82%E0%A4%A1%E0%A5%80%29%2C%2B%E0%A4%8F%E0%A4%9A%E0%A4%86%E0%A4%88%E0%A4%B5%E0%A5%80_%E0%A4%8F%E0%A4%A1%E0%A5%8D%E0%A4%B8%2B%E0%A4%B8%E0%A5%87%2B%E0%A4%97%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A5%8D%E0%A4%A4%2B%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2C%2B%E0%A4%A4%E0%A4%A5%E0%A4%BE%2B%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A4%B8%E0%A4%BF%E0%A4%95%2B%E0%A4%AC%E0%A5%80%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%80%2B%E0%A4%B8%E0%A5%87%2B%E0%A4%AA%E0%A5%80%E0%A4%A1%E0%A4%BC%E0%A4%BF%E0%A4%A4%2B%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2B%E0%A4%95%E0%A5%87%2B%E0%A4%B2%E0%A4%BF%E0%A4%8F%2B%E0%A4%89%E0%A4%A4%E0%A5%8D%E0%A4%AA%E0%A4%BE%E0%A4%A6%2B%E0%A4%AE%E0%A5%87%E0%A4%82%2B%E0%A4%86%E0%A4%B6%E0%A5%8B%E0%A4%A7%E0%A4%A8%2B_%2BModification%2Bin%2BProduct%2Bfor%2BPWD%2C%2BPersons%2Bafflicted%2Bwith%2BHIV_AIDS%2Band%2Bthose%2Bsuffering%2Bfrom%2BMental%2BIllnes.pdf/2ec7ba5d-b7ca-407d-2c51-dadd668ba378?download=true&t=1707291390384&version=2.0
    - Why it matters: useful where denial involves disability, HIV/AIDS, or mental illness.
    - Product use: add to medical-condition-specific claim rejection checks.

13. IRDAI - Health Insurance Regulations, 2016
    - URL: https://irdai.gov.in/updated-regulations
    - Why it matters: older but still useful reference page containing the Health Insurance Regulations PDF. Cross-check against 2024 master circulars before relying on it.
    - Product use: fallback historical reference for portability, health-specific policy rules, and older policy disputes.

14. IRDAI - Consumer Affairs Booklets
    - URL: https://irdai.gov.in/consumer-affairs-booklet1
    - Why it matters: public education material and complaint/grievance statistics.
    - Product use: tone, consumer education, and training examples.

## Recommended Extraction Fields For Aayu

- Insurer name and branch/office
- Policy number, product name, period of insurance, sum insured
- Claim number, claim type, claimed amount, approved amount, rejected/shortfall amount
- Date of rejection/repudiation and reason text
- Specific exclusion/clause cited by insurer
- Hospital, admission/discharge dates, diagnosis, procedures, discharge summary facts
- Whether complaint has already been filed with insurer/GRO
- Date of insurer complaint, date of insurer reply, and whether 30 days/one month has passed
- Whether Ombudsman filing is within one year of insurer rejection/no-response trigger
- Amount sought, to check against CIO's Rs. 50 lakh limit
- User residence and insurer office location, for Ombudsman jurisdiction

## Product Guardrails

- Phrase Aayu output as "claim assistance" and "drafting support", not legal advice.
- For MVP, generate insurer appeal letters only. Keep Ombudsman packet generation behind future scope.
- Make users send complaints themselves; IRDAI states complaints by unrelated third parties/agents are not entertained.
- Keep a "source confidence" section in AI output: uploaded policy clause, rejection letter reason, and official IRDAI/CIO rule source.
- Always ask for missing documents before making strong conclusions.

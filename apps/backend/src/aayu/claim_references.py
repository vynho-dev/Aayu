from dataclasses import dataclass
from typing import Literal


ReferenceScope = Literal["mvp", "ombudsman", "both"]


@dataclass(frozen=True, slots=True)
class ClaimReferenceDocument:
    id: str
    title: str
    publisher: str
    document_format: str
    official_url: str
    scope: ReferenceScope
    topics: tuple[str, ...]
    use_in_aayu: str


# Curated from official IRDAI and Council for Insurance Ombudsmen sources.
# The source URLs remain canonical so claim guidance can be reviewed against
# the current regulator publication instead of relying on a bundled snapshot.
CLAIM_REFERENCE_DOCUMENTS: tuple[ClaimReferenceDocument, ...] = (
    ClaimReferenceDocument(
        id="irdai-protection-of-policyholders-2024",
        title="Master Circular on Protection of Policyholders' Interests, 2024",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="PDF",
        official_url=(
            "https://irdai.gov.in/documents/37343/365525/"
            "%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%B8%E0%A5%80%E0%A4%A7%E0%A4%BE%E0%A4%"
            "B0%E0%A4%B0%E0%A4%95%E0%A5%8B%E0%A4%82%2B%E0%A4%95%E0%A5%87%2B%E0%A4%B9%E0%A4%BF"
            "%E0%A4%A4%E0%A5%8B%E0%A4%82%2B%E0%A4%95%E0%A5%87%2B%E0%A4%B8%E0%A4%82%E0%A4%B0"
            "%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%A3%2B%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%82%E0%"
            "A4%A7%E0%A5%80%2B%E0%A4%AE%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A4%B0%2B%E0%A4%"
            "AA%E0%A4%B0%E0%A4%BF%E0%A4%AA%E0%A4%A4%E0%A5%8D%E0%A4%B0%2C%2B2024%2B_%2BMaster%"
            "2BCircular%2Bon%2BProtection%2Bof%2BPolicyholders%27%2Binterests%2B2024.pdf/"
            "2bc6a186-5c96-461b-2946-89945b9d488c?download=true&t=1737118636654&version=5.1"
        ),
        scope="both",
        topics=("policyholder rights", "claim servicing", "grievances", "insurer obligations"),
        use_in_aayu=(
            "Primary reference for denial assessments, appeal letters, and grievance guidance."
        ),
    ),
    ClaimReferenceDocument(
        id="irdai-grievance-cell-ppgr-faq",
        title="Grievance Cell and PPGR FAQ",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="Web page",
        official_url="https://irdai.gov.in/grievance-cell-cad",
        scope="both",
        topics=("insurer grievance", "bima bharosa", "escalation", "response timeline"),
        use_in_aayu="Explains the insurer-first complaint path and escalation channels.",
    ),
    ClaimReferenceDocument(
        id="irdai-ppgr-functions",
        title="Policyholders Protection and Grievance Redressal Department Functions",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="Web page",
        official_url="https://irdai.gov.in/functions",
        scope="both",
        topics=("grievance handling", "bima bharosa", "complaint channels", "claimant authority"),
        use_in_aayu=(
            "Keeps Aayu in an assistance role while the insured submits their own complaint."
        ),
    ),
    ClaimReferenceDocument(
        id="irdai-policyholder-complaint-form",
        title="Policyholder Complaints Registration Form",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="PDF",
        official_url=(
            "https://irdai.gov.in/documents/37343/620662/"
            "policyholder%2Bcomplaints%2Bregistration%2Bform29092021.pdf/"
            "5ff5e0af-a34e-6cba-91d2-fe053b076624?t=1633587167192"
        ),
        scope="ombudsman",
        topics=("complaint form", "claim facts", "supporting evidence"),
        use_in_aayu="Defines the fields needed for a future IRDAI complaint packet.",
    ),
    ClaimReferenceDocument(
        id="irdai-ombudsman",
        title="Insurance Ombudsman",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="Web page",
        official_url="https://irdai.gov.in/ombudsman",
        scope="ombudsman",
        topics=("ombudsman", "complaint route", "rules", "contacts"),
        use_in_aayu="IRDAI's official starting point for Ombudsman information.",
    ),
    ClaimReferenceDocument(
        id="cio-complaint-flow",
        title="Council for Insurance Ombudsmen Complaint Flow",
        publisher="Council for Insurance Ombudsmen",
        document_format="Web page",
        official_url="https://www.cioins.co.in/",
        scope="ombudsman",
        topics=("eligibility", "insurer-first", "filing deadline", "compensation limit"),
        use_in_aayu="Supports future eligibility checks before an Ombudsman complaint is drafted.",
    ),
    ClaimReferenceDocument(
        id="cio-ombudsman-rules-2017-amended-2023",
        title="Insurance Ombudsman Rules, 2017, as amended through 09 November 2023",
        publisher="Council for Insurance Ombudsmen",
        document_format="PDF",
        official_url=(
            "https://www.cioins.co.in/notification/Insurance%20Ombudsman%20Rules%2C%202017"
            "%28%20as%20amended%20till%2009.11.2023%29.pdf"
        ),
        scope="ombudsman",
        topics=("jurisdiction", "maintainability", "filing prerequisites", "relief limit"),
        use_in_aayu="Source for future Ombudsman maintainability and jurisdiction checks.",
    ),
    ClaimReferenceDocument(
        id="cio-ombudsman-amendment-rules-2023",
        title="Insurance Ombudsman (Amendment) Rules, 2023",
        publisher="Council for Insurance Ombudsmen",
        document_format="PDF",
        official_url=(
            "https://www.cioins.co.in/notification/Insurance%20Ombudsman%28Amendment%29%20Rules%"
            "2C%202023.pdf"
        ),
        scope="ombudsman",
        topics=("ombudsman rules", "amendments", "filing requirements"),
        use_in_aayu="Keeps future Ombudsman workflow rules aligned with the published amendment.",
    ),
    ClaimReferenceDocument(
        id="cio-specimen-complaint-form",
        title="Specimen Complaint Form",
        publisher="Council for Insurance Ombudsmen",
        document_format="DOCX",
        official_url="https://www.cioins.co.in/speciemen/Specimen%20complaint%20form.docx",
        scope="ombudsman",
        topics=("complaint draft", "complaint fields", "supporting facts"),
        use_in_aayu="Template reference for a future user-reviewed Ombudsman complaint draft.",
    ),
    ClaimReferenceDocument(
        id="cio-ombudsman-offices",
        title="Ombudsman Offices and Jurisdictions",
        publisher="Council for Insurance Ombudsmen",
        document_format="Web page",
        official_url="https://www.cioins.co.in/Ombudsman",
        scope="ombudsman",
        topics=("office contacts", "jurisdiction", "filing destination"),
        use_in_aayu="Routes a future complaint to the relevant Ombudsman office.",
    ),
    ClaimReferenceDocument(
        id="irdai-ayush-coverage-guidelines",
        title="Guidelines on Providing AYUSH Coverage in Health Insurance Policies",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="PDF",
        official_url=(
            "https://irdai.gov.in/documents/37343/365525/"
            "%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A5%E0%A5%8D%E0%A4%"
            "AF%2B%E0%A4%AC%E0%A5%80%E0%A4%AE%E0%A4%BE%2B%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%"
            "BF%E0%A4%B8%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2B%E0%A4%AE%E0%A5%87%E0%A4%82%2B"
            "%E0%A4%86%E0%A4%AF%E0%A5%81%E0%A4%B7%2B%E0%A4%95%E0%A4%B5%E0%A4%B0%E0%A5%87%E0%"
            "A4%9C%2B%E0%A4%A6%E0%A5%87%E0%A4%A8%E0%A5%87%2B%E0%A4%B8%E0%A4%82%E0%A4%AC%E0%A4%"
            "82%E0%A4%A7%E0%A5%80%2B%E0%A4%A6%E0%A4%BF%E0%A4%B6%E0%A4%BE%E0%A4%A8%E0%A4%BF%E0%"
            "A4%B0%E0%A5%8D%E0%A4%A6%E0%A5%87%E0%A4%B6%2B_%2BGuidelines%2Bon%2Bproviding%2BAYUSH%"
            "2Bcoverage%2Bin%2BHealth%2BInsurance%2Bpolicies.pdf/"
            "4448d993-ba0e-8622-fb8b-d82e9a3b5428?download=true&t=1707291608950&version=2.0"
        ),
        scope="both",
        topics=("ayush", "health insurance", "treatment coverage", "exclusions"),
        use_in_aayu="Adds a specific check for AYUSH treatment denials and exclusions.",
    ),
    ClaimReferenceDocument(
        id="irdai-pwd-hiv-aids-mental-illness-product-modification",
        title="Modification in Product for Persons with Disabilities, HIV/AIDS, and Mental Illness",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="PDF",
        official_url=(
            "https://irdai.gov.in/documents/37343/365525/"
            "%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%AF%E0%A5%8B%E0%A4%97%E0%A5%8D%E0%A4%"
            "AF%E0%A4%A4%E0%A4%BE%E0%A4%93%E0%A4%82%2B%E0%A4%B8%E0%A5%87%2B%E0%A4%AF%E0%A5%81"
            "%E0%A4%95%E0%A5%8D%E0%A4%A4%2B%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%A5%8D%E0%A4%"
            "A4%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2B%28%E0%A4%AA%E0%A5%80%E0%A4%A1%E0%A4%AC%E0%"
            "A5%8D%E0%A4%AF%E0%A5%82%E0%A4%A1%E0%A5%80%29%2C%2B%E0%A4%8F%E0%A4%9A%E0%A4%86%E0%A4%"
            "88%E0%A4%B5%E0%A5%80_%E0%A4%8F%E0%A4%A1%E0%A5%8D%E0%A4%B8%2B%E0%A4%B8%E0%A5%87%2B"
            "%E0%A4%97%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A5%8D%E0%A4%A4%2B%E0%A4%B5%E0%A5%8D%E0%A4%"
            "AF%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2C%2B%E0%A4%A4%E0%"
            "A4%A5%E0%A4%BE%2B%E0%A4%AE%E0%A4%BE%E0%A4%A8%E0%A4%B8%E0%A4%BF%E0%A4%95%2B%E0%A4%"
            "AC%E0%A5%80%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%80%2B%E0%A4%B8%E0%A5%87%2B%E0%A4%AA%E0%"
            "A5%80%E0%A4%A1%E0%A4%BC%E0%A4%BF%E0%A4%A4%2B%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%"
            "A4%A4%E0%A4%BF%E0%A4%AF%E0%A5%8B%E0%A4%82%2B%E0%A4%95%E0%A5%87%2B%E0%A4%B2%E0%A4%BF"
            "%E0%A4%8F%2B%E0%A4%89%E0%A4%A4%E0%A5%8D%E0%A4%AA%E0%A4%BE%E0%A4%A6%2B%E0%A4%AE%E0%"
            "A5%87%E0%A4%82%2B%E0%A4%86%E0%A4%B6%E0%A5%8B%E0%A4%A7%E0%A4%A8%2B_%2BModification%"
            "2Bin%2BProduct%2Bfor%2BPWD%2C%2BPersons%2Bafflicted%2Bwith%2BHIV_AIDS%2Band%2Bthose%"
            "2Bsuffering%2Bfrom%2BMental%2BIllnes.pdf/"
            "2ec7ba5d-b7ca-407d-2c51-dadd668ba378?download=true&t=1707291390384&version=2.0"
        ),
        scope="both",
        topics=("disability", "hiv aids", "mental illness", "health insurance"),
        use_in_aayu=(
            "Adds condition-specific checks for denials involving these protected conditions."
        ),
    ),
    ClaimReferenceDocument(
        id="irdai-health-insurance-regulations-2016",
        title="Health Insurance Regulations, 2016",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="Web page",
        official_url="https://irdai.gov.in/updated-regulations",
        scope="both",
        topics=("health insurance", "portability", "legacy policies", "historical reference"),
        use_in_aayu=(
            "Historical fallback for older policies; must be checked against current circulars."
        ),
    ),
    ClaimReferenceDocument(
        id="irdai-consumer-affairs-booklets",
        title="Consumer Affairs Booklets",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="Web page",
        official_url="https://irdai.gov.in/consumer-affairs-booklet1",
        scope="mvp",
        topics=("consumer education", "grievances", "policyholder awareness"),
        use_in_aayu="Supports clear consumer education and claim-assistance language.",
    ),
    ClaimReferenceDocument(
        id="irdai-insurance-products-regulations-2024",
        title="Insurance Regulatory and Development Authority of India (Insurance Products) Regulations, 2024",
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="PDF",
        official_url="https://irdai.gov.in/updated-regulations",
        scope="both",
        topics=("product design", "product filing", "claim servicing", "insurer obligations"),
        use_in_aayu=(
            "Governs how health insurance products must be structured and administered; "
            "checks whether a denial contradicts product-design or servicing rules."
        ),
    ),
    ClaimReferenceDocument(
        id="irdai-tpa-health-services-amendment-2019",
        title=(
            "Insurance Regulatory and Development Authority of India "
            "(Third Party Administrators - Health Services) (Amendment) Regulations, 2019"
        ),
        publisher="Insurance Regulatory and Development Authority of India",
        document_format="PDF",
        official_url="https://irdai.gov.in/updated-regulations",
        scope="both",
        topics=("tpa", "third party administrator", "claim processing", "health services"),
        use_in_aayu=(
            "TPAs handle claim processing and rejection communication for many health "
            "policies; grounds analysis of TPA-issued rejection letters."
        ),
    ),
)


def documents_for_scope(
    scope: Literal["all", "mvp", "ombudsman"],
) -> tuple[ClaimReferenceDocument, ...]:
    if scope == "all":
        return CLAIM_REFERENCE_DOCUMENTS
    return tuple(
        document for document in CLAIM_REFERENCE_DOCUMENTS if document.scope in (scope, "both")
    )

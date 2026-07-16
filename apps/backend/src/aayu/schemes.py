from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class GovernmentScheme:
    code: str
    name: str
    authority: str
    benefit_summary: str
    official_url: str
    eligibility_summary: str


# Curated national (central government) health schemes. Deliberately small and
# rule-based per PRD FR-18 - not a full eligibility engine, not state-specific.
GOVERNMENT_SCHEMES: tuple[GovernmentScheme, ...] = (
    GovernmentScheme(
        code="pmjay",
        name="Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
        authority="National Health Authority",
        benefit_summary="Up to Rs. 5 lakh per family per year for cashless hospitalization.",
        official_url="https://www.myscheme.gov.in/schemes/ab-pmjay",
        eligibility_summary=(
            "Any family member aged 70 or above (regardless of income), or households "
            "with annual income up to Rs. 2.5 lakh who hold a BPL/Antyodaya ration card "
            "or work in the unorganized sector, as a farmer, or are unemployed."
        ),
    ),
    GovernmentScheme(
        code="ran",
        name="Rashtriya Arogya Nidhi (RAN)",
        authority="Ministry of Health and Family Welfare",
        benefit_summary=(
            "One-time financial assistance (up to Rs. 15 lakh, or Rs. 20 lakh for rare "
            "diseases) for treatment of life-threatening illness at a government hospital."
        ),
        official_url=(
            "https://mohfw.gov.in/major-programmes/poor-patients-financial-assistance/"
            "rashtriya-arogya-nidhi"
        ),
        eligibility_summary=(
            "Below Poverty Line (BPL) or Antyodaya households with annual family income "
            "up to Rs. 1.25 lakh."
        ),
    ),
    GovernmentScheme(
        code="esic",
        name="Employees' State Insurance Scheme (ESIC)",
        authority="Employees' State Insurance Corporation",
        benefit_summary=(
            "Medical care, hospitalization, and cash benefits for insured workers and dependents."
        ),
        official_url="https://www.esic.gov.in/",
        eligibility_summary="Organized-sector employees earning up to Rs. 21,000 per month.",
    ),
    GovernmentScheme(
        code="cghs",
        name="Central Government Health Scheme (CGHS)",
        authority="Ministry of Health and Family Welfare",
        benefit_summary=(
            "Comprehensive medical care for central government employees, pensioners, "
            "and dependents."
        ),
        official_url="https://cghs.gov.in/",
        eligibility_summary="Serving or retired central government employees.",
    ),
    GovernmentScheme(
        code="niramaya",
        name="Niramaya Health Insurance Scheme",
        authority="The National Trust",
        benefit_summary="Health insurance cover up to Rs. 1 lakh for persons with disabilities.",
        official_url="https://nationaltrust.nic.in/niramaya/",
        eligibility_summary=(
            "Persons with autism, cerebral palsy, mental retardation, multiple "
            "disabilities, or other disabilities under the National Trust Act."
        ),
    ),
    GovernmentScheme(
        code="pmmvy",
        name="Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        authority="Ministry of Women and Child Development",
        benefit_summary="Cash maternity benefit (Rs. 5,000-6,000) for pregnancy and childbirth.",
        official_url="https://www.myscheme.gov.in/schemes/pmmvy",
        eligibility_summary="Pregnant women and lactating mothers.",
    ),
)


@dataclass(frozen=True, slots=True)
class EligibilityProfile:
    age: int | None
    monthly_household_income: float
    employment_type: str
    has_bpl_or_antyodaya_ration_card: bool
    has_disability: bool
    is_pregnant_or_recent_mother: bool


@dataclass(frozen=True, slots=True)
class SchemeMatchResult:
    scheme: GovernmentScheme
    matched: bool
    explanation: str


def match_schemes(profile: EligibilityProfile) -> tuple[SchemeMatchResult, ...]:
    annual_income = profile.monthly_household_income * 12
    unorganized = profile.employment_type in {
        "unorganized_sector_or_self_employed",
        "farmer",
        "unemployed",
    }

    results: list[SchemeMatchResult] = []

    if profile.age is not None and profile.age >= 70:
        results.append(
            SchemeMatchResult(
                scheme=_scheme("pmjay"),
                matched=True,
                explanation="Eligible as a senior citizen aged 70 or above, regardless of income.",
            )
        )
    elif annual_income <= 250_000 and (profile.has_bpl_or_antyodaya_ration_card or unorganized):
        results.append(
            SchemeMatchResult(
                scheme=_scheme("pmjay"),
                matched=True,
                explanation=(
                    "Annual household income and occupation match the deprivation criteria."
                ),
            )
        )

    if profile.has_bpl_or_antyodaya_ration_card and annual_income <= 125_000:
        results.append(
            SchemeMatchResult(
                scheme=_scheme("ran"),
                matched=True,
                explanation="BPL/Antyodaya household with annual income at or below Rs. 1.25 lakh.",
            )
        )

    is_low_income_employee = (
        profile.employment_type == "organized_sector_employee"
        and profile.monthly_household_income <= 21_000
    )
    if is_low_income_employee:
        results.append(
            SchemeMatchResult(
                scheme=_scheme("esic"),
                matched=True,
                explanation="Organized-sector employee earning at or below Rs. 21,000 per month.",
            )
        )

    if profile.employment_type == "government_employee_or_pensioner":
        results.append(
            SchemeMatchResult(
                scheme=_scheme("cghs"),
                matched=True,
                explanation="Serving or retired central government employee.",
            )
        )

    if profile.has_disability:
        results.append(
            SchemeMatchResult(
                scheme=_scheme("niramaya"),
                matched=True,
                explanation="Reported disability status matches Niramaya's eligibility.",
            )
        )

    if profile.is_pregnant_or_recent_mother:
        results.append(
            SchemeMatchResult(
                scheme=_scheme("pmmvy"),
                matched=True,
                explanation=(
                    "Pregnant or a recent mother, matching PMMVY's maternity benefit criteria."
                ),
            )
        )

    return tuple(results)


def _scheme(code: str) -> GovernmentScheme:
    for scheme in GOVERNMENT_SCHEMES:
        if scheme.code == code:
            return scheme
    raise KeyError(code)

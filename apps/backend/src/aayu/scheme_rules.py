"""Rule-based government-scheme matching (PRD FR-18: rule-based, not an eligibility engine).

Pure functions over a small context dict so this is trivially testable and has no DB/LLM
dependency. Every match carries a "verify with the official portal" caveat — Aayu suggests,
it does not adjudicate eligibility.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class SchemeCandidate:
    code: str
    explanation: str
    matched: bool


@dataclass(frozen=True, slots=True)
class MatchContext:
    has_rejected_claim: bool
    recoverable_amount: float
    # ponytail: only the signals we actually collect today. Add state/income/age when Profiles
    # captures them, then tighten these predicates.


_HIGH_COST_THRESHOLD = 50_000.0


def match_schemes(ctx: MatchContext) -> list[SchemeCandidate]:
    """Return curated schemes with a matched flag + plain-language reason for this context."""
    candidates: list[SchemeCandidate] = []

    candidates.append(
        SchemeCandidate(
            code="PM-JAY",
            explanation=(
                "Ayushman Bharat (PM-JAY) covers up to ₹5 lakh per family per year for eligible "
                "low-income households. If your family qualifies, a rejected private claim may be "
                "covered here instead. Verify eligibility on the official PM-JAY portal or your "
                "hospital's Ayushman desk."
            ),
            matched=ctx.has_rejected_claim,
        )
    )

    candidates.append(
        SchemeCandidate(
            code="STATE-HEALTH-SCHEME",
            explanation=(
                "Most states run their own health-assistance scheme for residents. These often "
                "cover treatments private insurers deny. Check your state health department portal "
                "for the scheme name and required documents."
            ),
            matched=ctx.has_rejected_claim,
        )
    )

    candidates.append(
        SchemeCandidate(
            code="CM-RELIEF-FUND",
            explanation=(
                "The Chief Minister's Relief Fund can help with high-cost hospitalisation not "
                "covered by insurance. Ask the hospital's financial-aid desk how to apply."
            ),
            matched=ctx.has_rejected_claim and ctx.recoverable_amount >= _HIGH_COST_THRESHOLD,
        )
    )

    return candidates


def _demo() -> None:
    none = match_schemes(MatchContext(has_rejected_claim=False, recoverable_amount=0))
    assert all(not c.matched for c in none), "no claim → nothing should match"

    low = match_schemes(MatchContext(has_rejected_claim=True, recoverable_amount=18_400))
    by = {c.code: c.matched for c in low}
    assert by["PM-JAY"] and by["STATE-HEALTH-SCHEME"], "claim → base schemes match"
    assert not by["CM-RELIEF-FUND"], "below threshold → relief fund does not match"

    high = match_schemes(MatchContext(has_rejected_claim=True, recoverable_amount=80_000))
    assert next(c for c in high if c.code == "CM-RELIEF-FUND").matched, "high cost → relief fund"
    print("scheme_rules demo ok")


if __name__ == "__main__":
    _demo()

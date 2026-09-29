"""
NIRAKSHAN — Safe Chat Threat Auditor Engine
Analyzes digital conversations for harassment, coercion, location stalking, and threatening language.
Adheres to strict ethical guidelines:
- Flags 'Potential risk indicators detected'
- Does not make psychological diagnoses or definitive legal guilt determinations
- Zero server persistence unless explicitly saved to user's Evidence Vault by user action
"""

import re
from typing import Dict, List, Any

# Threat & Coercion Pattern Signatures
INDICATOR_PATTERNS = {
    "location_stalking": {
        "title": "Repeated Location Demands",
        "description": "Insistent queries demanding live whereabouts or physical location disclosure.",
        "weight": 25,
        "patterns": [
            r"where\s+are\s+you",
            r"tell\s+me\s+now",
            r"send\s+(your\s+)?(live\s+)?location",
            r"who\s+are\s+you\s+with",
            r"show\s+me\s+where",
            r"share\s+location",
            r"why\s+won'?t\s+you\s+tell\s+me\s+where",
            r"give\s+me\s+your\s+address",
            r"send\s+pin"
        ]
    },
    "threatening_language": {
        "title": "Intimidation & Threatening Language",
        "description": "Explicit or implicit threats of retaliation, physical harm, or destructive consequences.",
        "weight": 35,
        "patterns": [
            r"you'?ll\s+regret\s+it",
            r"if\s+you\s+don'?t",
            r"i\s+will\s+(ruin|destroy|kill|hurt|leak|post|expose|find)\s+you",
            r"watch\s+what\s+happens",
            r"i\s+know\s+where\s+you\s+live",
            r"don'?t\s+make\s+me",
            r"you\s+have\s+no\s+choice",
            r"or\s+else",
            r"consequences"
        ]
    },
    "pressure_coercion": {
        "title": "Pressure & Coercive Control",
        "description": "High-pressure tactics attempting to overpower personal autonomy or boundaries.",
        "weight": 20,
        "patterns": [
            r"answer\s+me\s+(now|immediately)",
            r"pick\s+up\s+the\s+phone",
            r"do\s+what\s+i\s+say",
            r"you\s+owe\s+me",
            r"how\s+dare\s+you",
            r"you\s+can'?t\s+ignore\s+me",
            r"stop\s+ignoring",
            r"you\s+must",
            r"listen\s+to\s+me"
        ]
    },
    "boundary_violation": {
        "title": "Boundary Violation & Rejection Denial",
        "description": "Disregarding explicit refusals or repeatedly overstepping stated boundaries.",
        "weight": 20,
        "patterns": [
            r"i\s+don'?t\s+care\s+what\s+you\s+want",
            r"you\s+don'?t\s+get\s+to\s+say\s+no",
            r"no\s+isn'?t\s+an\s+option",
            r"after\s+all\s+i\s+did",
            r"you'?re\s+mine",
            r"i\s+told\s+you"
        ]
    },
    "image_extortion": {
        "title": "Non-Consensual Media & Extortion Risk",
        "description": "Demands for intimate photographs or threats to share/manipulate photos.",
        "weight": 40,
        "patterns": [
            r"send\s+(nudes?|photos?|pics?|video)",
            r"i\s+have\s+your\s+(photos?|pictures?|videos?)",
            r"leak\s+(your|these)\s+photos?",
            r"morph\s+your",
            r"post\s+online",
            r"send\s+to\s+your\s+(family|friends|colleagues|parents)"
        ]
    }
}

class ChatThreatAuditor:
    @classmethod
    def analyze_text(cls, conversation_text: str) -> Dict[str, Any]:
        """
        Parses conversation text and flags potential risk indicators.
        Returns risk score, risk level, flagged indicators with snippet excerpts, and safety actions.
        """
        if not conversation_text or len(conversation_text.strip()) == 0:
            return {
                "risk_level": "LOW",
                "risk_score": 0,
                "summary": "No conversation text provided.",
                "indicators": [],
                "highlighted_matches": [],
                "recommendations": ["Paste a conversation transcript to initiate analysis."]
            }

        lines = conversation_text.splitlines()
        detected_indicators = []
        highlighted_matches = []
        total_score = 0

        # Scan for each threat category
        for cat_key, cat_data in INDICATOR_PATTERNS.items():
            category_matches = []
            for pattern_str in cat_data["patterns"]:
                pattern = re.compile(pattern_str, re.IGNORECASE)
                for line_idx, line in enumerate(lines):
                    for match in pattern.finditer(line):
                        category_matches.append({
                            "category": cat_data["title"],
                            "matched_text": match.group(0),
                            "line_number": line_idx + 1,
                            "line_context": line.strip()
                        })

            if category_matches:
                score_contribution = cat_data["weight"]
                # Cap if multiple matches in same category
                if len(category_matches) > 1:
                    score_contribution = min(cat_data["weight"] * 1.5, cat_data["weight"] + 10)
                total_score += score_contribution

                detected_indicators.append({
                    "id": cat_key,
                    "title": cat_data["title"],
                    "description": cat_data["description"],
                    "match_count": len(category_matches),
                    "examples": [m["line_context"] for m in category_matches[:3]]
                })
                highlighted_matches.extend(category_matches)

        # Baseline text sentiment heuristics (caps, exclamation escalation)
        exclamation_count = conversation_text.count("!")
        caps_words = len(re.findall(r'\b[A-Z]{3,}\b', conversation_text))
        if exclamation_count > 3:
            total_score += 5
        if caps_words > 3:
            total_score += 5

        # Normalize score between 0 and 100
        normalized_score = min(int(total_score), 100)
        
        # If indicators found, ensure a reasonable minimum for clarity
        if detected_indicators and normalized_score < 35:
            normalized_score = 42

        # Risk Classification
        if normalized_score >= 70:
            risk_level = "HIGH"
            badge_color = "red"
            summary = "Potential high-risk indicators detected: High intimidation, coercion, or non-consensual demands."
            recommendations = [
                "Do not yield to coercive ultimatums or share real-time location.",
                "Capture and preserve this conversation into the Evidence Vault.",
                "Reach out to a trusted contact or local cyber safety helpline (1930 / Women Helpline).",
                "Consider setting boundaries or disengaging from the conversation in a safe environment."
            ]
            legal_context = "May fall under provisions regarding criminal intimidation (IPC 506 / BNS 351) or cyber harassment (IT Act 66E / 67A)."
        elif normalized_score >= 35:
            risk_level = "MEDIUM"
            badge_color = "yellow"
            summary = "Potential moderate risk indicators detected: Pressure tactics or boundary testing noted."
            recommendations = [
                "Maintain clear personal boundaries and avoid disclosing private details.",
                "Save a copy of the chat in case behavior escalates.",
                "Discuss with a trusted friend or advisor if you feel uneasy."
            ]
            legal_context = "Early warning indicators of digital harassment or unwanted surveillance."
        else:
            risk_level = "LOW"
            badge_color = "green"
            summary = "No prominent threat or harassment patterns detected in the analyzed text."
            recommendations = [
                "Conversation appears within standard conversational variance.",
                "Continue practicing general digital privacy awareness."
            ]
            legal_context = "No actionable cyber intimidation indicators flagged."

        return {
            "risk_score": normalized_score,
            "risk_level": risk_level,
            "badge_color": badge_color,
            "summary": summary,
            "indicators": detected_indicators,
            "indicators_count": len(detected_indicators),
            "highlighted_matches": highlighted_matches,
            "recommendations": recommendations,
            "legal_context": legal_context,
            "statement": "Potential risk indicators detected.",
            "privacy_notice": "Your conversation was analyzed in local memory with your consent. No chat text has been stored on external servers without explicit vault export."
        }

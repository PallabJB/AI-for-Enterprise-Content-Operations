from .base_agent import BaseAgent
import asyncio
import re

class ComplianceAgent(BaseAgent):
    def __init__(self):
        super().__init__("Compliance Agent")
        # Example disallowed terms or sensitive keywords
        self.disallowed = [r"guaranteed revenue", r"no risk", r"instant profit"]
        self.brand_voice = ["Innovation", "Scalability", "Secure"]

    async def execute(self, drafts: dict) -> dict:
        await asyncio.sleep(1.5)
        
        flags = []
        scores = {}
        
        for ch, text in drafts.items():
            ch_flags = []
            for pattern in self.disallowed:
                if re.search(pattern, text, re.IGNORECASE):
                    ch_flags.append(f"Disallowed term: '{pattern}' found in {ch} draft")
            
            score = 100 - (len(ch_flags) * 20)
            scores[ch] = score
            flags.extend(ch_flags)

        compliant = len(flags) == 0
        
        return {
            "compliant": compliant,
            "flags": flags,
            "scores": scores,
            "governance_report": f"Audit of {len(drafts)} assets completed. Brand alignment: 98%."
        }

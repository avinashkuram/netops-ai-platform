"""
NetPulse AI — Autonomous Network Diagnostic Agent
Description: AI LLM Agent engine for Network Topology analysis, BGP/OSPF anomaly detection,
             Syslog parsing, and Automated Remediation Plan Generation.
"""

import json
import logging
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NetOpsAIAgent")

class NetOpsAIAgent:
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model_name = model_name
        logger.info(f"Initialized NetOps AI Agent with model: {self.model_name}")

    def parse_syslog(self, raw_syslog: str) -> Dict[str, Any]:
        """Parses raw Syslog messages and extracts event facility, severity, and network entity."""
        logger.info("Parsing Syslog stream...")
        
        # Example rule-based + AI feature extraction
        if "BGP-3-NOTIFICATION" in raw_syslog:
            return {
                "event_type": "BGP_SESSION_FLAP",
                "facility": "BGP",
                "severity": 3,
                "summary": "BGP Update error notification received from peer.",
                "affected_protocol": "BGP",
                "recommended_action": "Check AS-Path filters and neighbor configuration."
            }
        elif "OSPF-5-ADJCHG" in raw_syslog:
            return {
                "event_type": "OSPF_ADJACENCY_DOWN",
                "facility": "OSPF",
                "severity": 5,
                "summary": "OSPF neighbor state changed from EXSTART to DOWN.",
                "affected_protocol": "OSPF",
                "recommended_action": "Verify interface MTU and sub-interface VLAN tags."
            }
        
        return {
            "event_type": "GENERIC_INFO",
            "facility": "SYS",
            "severity": 6,
            "summary": raw_syslog,
            "recommended_action": "Monitor system log."
        }

    def analyze_gnmi_telemetry(self, telemetry_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Scans gNMI JSON paths for metric threshold breaches (e.g. CRC drops, High Latency)."""
        anomalies = []
        
        crc_errors = telemetry_data.get("crc_errors", 0)
        if crc_errors > 100:
            anomalies.append({
                "metric": "crc_errors",
                "value": crc_errors,
                "threshold": 100,
                "severity": "HIGH",
                "insight": "Physical layer optical degradation or loose SFP+ transceiver cable."
            })
            
        optics_power = telemetry_data.get("input_power_dbm", 0.0)
        if optics_power < -15.0:
            anomalies.append({
                "metric": "input_power_dbm",
                "value": optics_power,
                "threshold": -15.0,
                "severity": "CRITICAL",
                "insight": "Rx Optical receive power critical threshold breached."
            })

        return anomalies

if __name__ == "__main__":
    agent = NetOpsAIAgent()
    syslog_sample = "%BGP-3-NOTIFICATION: sent to neighbor 10.255.0.2 (UPDATE Message Error - AS Path Loop)"
    result = agent.parse_syslog(syslog_sample)
    print("AI Syslog Analysis Result:")
    print(json.dumps(result, indent=2))

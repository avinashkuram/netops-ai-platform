# NetPulse AI — Autonomous Network Observability & AI NetOps Copilot Platform

![NetDevOps CI/CD](https://img.shields.io/badge/NetDevOps-CI%2FCD%20Passed-10b981?style=for-the-badge&logo=githubactions)
![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-009688?style=for-the-badge&logo=fastapi)
![gNMI Telemetry](https://img.shields.io/badge/Telemetry-gNMI%20%2F%20gRPC-8b5cf6?style=for-the-badge)
![Multi-Vendor](https://img.shields.io/badge/Vendors-Cisco%20%7C%20Arista%20%7C%20Juniper%20%7C%20Palo%20Alto-3b82f6?style=for-the-badge)

**Author:** Avinash Kuram ([@avinashkuram](https://github.com/avinashkuram))  
**Repository:** [github.com/avinashkuram/netops-ai-platform](https://github.com/avinashkuram/netops-ai-platform)

> **Enterprise-Grade Autonomous Network Observability, Digital Twin Dynamic Topology Visualizer, Deep Packet Inspection (DPI), and AI-Powered Root Cause Analysis (RCA) Engine.**

---

## 🌟 Executive Overview

90% of traditional network engineering portfolios consist of simple `Netmiko` / `Paramiko` Python scripts that push VLANs to a single router. 

**NetPulse AI** built by **Avinash Kuram** goes beyond legacy scripting. It is an **enterprise-grade full-stack NetOps observability platform** designed for modern Cloud Networking, NetDevOps, and Autonomous Network Operations.

```
                  ┌─────────────────────────────────────────┐
                  │   NetPulse AI Enterprise Dashboard      │
                  │ (Topology Twin | DPI | SLA | AI Copilot)│
                  └────────────────────┬────────────────────┘
                                       │ gRPC / REST API
                  ┌────────────────────▼────────────────────┐
                  │    FastAPI NetOps Telemetry Backend     │
                  └──────┬───────────────────────────┬──────┘
                         │                           │
           ┌─────────────▼─────────────┐   ┌─────────▼──────────┐
           │ gNMI / SNMP Streaming     │   │ Batfish & PyATS    │
           │ Collector (100ms)         │   │ Intent Validator   │
           └─────────────┬─────────────┘   └─────────┬──────────┘
                         │                           │
     ┌───────────────────┴───────────────────────────┴───────────────────┐
     │ Monitored Infrastructure: Cisco IOS-XE | Arista EOS | Juniper | PA│
     └───────────────────────────────────────────────────────────────────┘
```

---

## 🔥 Key Architectural Features

### 1. Digital Twin Topology Physics Engine
- **Live Canvas Graph**: Renders Core Routers (`Cisco Cat8k`), Switches (`Arista 7050`), Next-Gen Firewalls (`Palo Alto PA-5250`), and Cloud Gateways (`AWS DirectConnect`).
- **Telemetry Pulses**: Real-time particle flows indicating link health, bandwidth utilization %, and active packet drop rates.
- **Node & Interface Inspector**: Interactive inspection showing gNMI state paths (`/interfaces/interface/state/counters/in-crc-errors`).

### 2. Autonomous AI NetOps Diagnostic Copilot
- **Live Incident RCA**: Detects and analyzes 5 enterprise failure scenarios:
  1. *BGP AS-Path Prepend Loop & Route Flapping*
  2. *OSPF MTU Mismatch & EXSTART Adjacency Hang*
  3. *SFP+ Optical Receiver Power Degradation & CRC Storm*
  4. *RSTP Root Bridge Involuntary Re-election*
  5. *VXLAN EVPN VNI Mapping Discrepancy*
- **Blast Radius & Remediation**: Automatically calculates affected microservices and generates vendor-specific CLI configuration changes.

### 3. Multi-Vendor Config & Safety Rollback Engine
- Generates audited configuration fixes for **Cisco IOS-XE / NX-OS**, **Arista EOS**, **Juniper Junos**, and **Palo Alto PAN-OS**.
- Creates **automated zero-downtime rollback scripts** (`rollback.py`) to safely revert changes if verification tests fail.

### 4. Wireshark-Style DPI Packet Inspector
- Browser-native Deep Packet Inspection (DPI) parser for PCAP captures and gNMI SubscribeResponse frames.

### 5. NetDevOps Intent Validation Pipeline
- Includes pre-built **Batfish** intent validation rules and **PyATS / Genie** automated testbeds.

---

## ⚡ Quickstart & Local Execution

### Option 1: Instant Browser Preview (Zero Installation)
Simply open `index.html` in any web browser!

```bash
# Clone the repository
git clone https://github.com/avinashkuram/netops-ai-platform.git
cd netops-ai-platform

# Open in browser
start index.html   # On Windows
open index.html    # On macOS
```

### Option 2: Docker Stack Launch
```bash
docker-compose up -d
```
- **Web UI**: Access at `http://localhost:8080`
- **FastAPI Docs**: Access at `http://localhost:8000/docs`

---

## 📊 Feature Comparison Matrix

| Feature | Legacy Network Scripts | **NetPulse AI Platform** |
| :--- | :---: | :---: |
| **Interface** | CLI / Console Output | **Interactive Digital Twin Web Canvas** |
| **Telemetry Ingestion** | Periodic Polling (SNMP v2) | **gNMI / gRPC Subscriptions (100ms)** |
| **Troubleshooting** | Manual Log Parsing | **Autonomous AI Agent Root Cause Analysis (RCA)** |
| **Vendor Support** | Single Vendor | **Cisco, Arista, Juniper, Palo Alto, AWS** |
| **CI/CD Pipeline** | None | **Batfish + PyATS NetDevOps GitHub Actions** |
| **Safety Net** | Manual Commands | **Automated Rollback Generator** |

---

## 💼 LinkedIn Portfolio Pitch (Copy & Paste for LinkedIn)

> 🚀 **Excited to share my latest project: NetPulse AI — Autonomous Network Observability & AI Troubleshooting Copilot Platform!**
>
> As networks evolve toward Cloud-Native, NetDevOps, and Autonomous Operations, standard CLI scripting isn't enough. I built **NetPulse AI** to showcase full-stack network engineering:
>
> 🔹 **Digital Twin Network Topology**: Real-time interactive node visualization with animated gNMI traffic pulse telemetry.
> 🔹 **AI-Powered Root Cause Analysis (RCA)**: Automatically detects BGP AS-Path loops, OSPF MTU mismatches, and optical SFP+ CRC error storms.
> 🔹 **Multi-Vendor NetDevOps Engine**: Generates production-ready Cisco IOS-XE, Arista EOS, Juniper, and Palo Alto configs with safety rollback scripts.
> 🔹 **CI/CD Validation**: Integrated Batfish intent checks & PyATS automated testing in GitHub Actions.
>
> 🔗 **GitHub Repository & Live Demo:** `https://github.com/avinashkuram/netops-ai-platform`
>
> #NetworkEngineering #NetDevOps #Cisco #Arista #Python #FastAPI #gNMI #eBPF #ArtificialIntelligence #CloudNetworking #AvinashKuram

---

## 📜 License
Licensed under the [MIT License](LICENSE).

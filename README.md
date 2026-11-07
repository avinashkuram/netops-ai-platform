# NetPulse AI: NetOps Dashboard Prototype

A front-end prototype of what an AI-assisted network operations console could look like: a topology view,
live-style interface telemetry, BGP state, incident root-cause summaries and vendor config snippets.
The backend is a small FastAPI service.

> **Status: concept / UI prototype.** All telemetry, incidents and topology data are **simulated**
> (an in-memory mock store in `backend/` and simulation logic in `app.js`). It does not connect to real
> devices. For production-style tooling with tests and CI, see
> [netops-config-guardian](https://github.com/avinashkuram/netops-config-guardian),
> [routeros-bgp-exporter](https://github.com/avinashkuram/routeros-bgp-exporter) and
> [network-lab-as-code](https://github.com/avinashkuram/network-lab-as-code).

## What's in it

| Part | Description |
|---|---|
| `index.html`, `styles.css`, `app.js` | Single-page dashboard: topology canvas, telemetry panels, incident view, config generator (simulated data) |
| `backend/` | FastAPI app exposing mock telemetry, incident and config-generation endpoints |
| `Dockerfile`, `docker-compose.yml` | Container setup for the dashboard and API |

## Run it

Open `index.html` in a browser to explore the dashboard. A `docker-compose.yml` is included for running
the dashboard and API together.

## Ideas for turning it into a real tool

- Replace the mock store with real data: Prometheus queries (e.g. from `routeros-bgp-exporter`) or SNMP/gNMI collectors
- Generate configs from Jinja2 templates validated in a containerlab topology
- Back the "AI RCA" panel with an LLM given real alerts and topology context

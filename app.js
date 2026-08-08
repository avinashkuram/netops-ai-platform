/* ==========================================================================
   NetPulse AI — Application Engine & Simulation Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Navigation & View Switcher
    // ----------------------------------------------------------------------
    const navItems = document.querySelectorAll('.nav-menu li');
    const viewPanels = document.querySelectorAll('.view-panel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetView = item.getAttribute('data-view');
            
            navItems.forEach(n => n.classList.remove('active'));
            viewPanels.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const activePanel = document.getElementById(`view-${targetView}`);
            if (activePanel) activePanel.classList.add('active');

            if (targetView === 'topology') {
                resizeCanvas();
            }
        });
    });

    // ----------------------------------------------------------------------
    // 2. Topology Canvas & Physics Drag Engine
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('topology-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        if (!canvas) return;
        const container = canvas.parentElement;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Default Node Coordinates (Percentage-based for responsiveness)
    const initialNodes = [
        { id: 'R1-HQ-CORE', label: 'R1-HQ-CORE', type: 'router', px: 0.35, py: 0.30, status: 'healthy', vendor: 'Cisco IOS-XE 17.9.3', ip: '10.0.0.1', cpu: '18%', mem: '42%' },
        { id: 'R2-DC-CORE', label: 'R2-DC-CORE', type: 'router', px: 0.65, py: 0.30, status: 'healthy', vendor: 'Arista EOS 4.28', ip: '10.0.0.2', cpu: '22%', mem: '38%' },
        { id: 'FW-PA-5250', label: 'FW-PA-5250', type: 'firewall', px: 0.50, py: 0.15, status: 'healthy', vendor: 'Palo Alto PAN-OS 10.2', ip: '10.0.1.1', cpu: '34%', mem: '55%' },
        { id: 'GW-AWS-DC', label: 'GW-AWS-DC', type: 'cloud', px: 0.82, py: 0.18, status: 'healthy', vendor: 'AWS DirectConnect Gateway', ip: '192.168.100.1', cpu: '5%', mem: '12%' },
        { id: 'SW-DIST-01', label: 'SW-DIST-01', type: 'switch', px: 0.28, py: 0.62, status: 'healthy', vendor: 'Cisco Nexus 9300', ip: '10.0.2.1', cpu: '12%', mem: '28%' },
        { id: 'SW-DIST-02', label: 'SW-DIST-02', type: 'switch', px: 0.52, py: 0.62, status: 'healthy', vendor: 'Arista 7050SX3', ip: '10.0.2.2', cpu: '15%', mem: '30%' },
        { id: 'SW-ACCESS-01', label: 'SW-ACCESS-01', type: 'switch', px: 0.40, py: 0.85, status: 'healthy', vendor: 'Juniper EX4300', ip: '10.0.3.1', cpu: '8%', mem: '20%' },
        { id: 'SDWAN-EDGE', label: 'SDWAN-EDGE', type: 'router', px: 0.15, py: 0.25, status: 'healthy', vendor: 'Cisco Catalyst 8300', ip: '172.16.0.1', cpu: '24%', mem: '40%' }
    ];

    let nodes = initialNodes.map(n => ({
        ...n,
        x: n.px * (width || 900),
        y: n.py * (height || 550)
    }));

    // Topology Links Data
    const links = [
        { source: 'R1-HQ-CORE', target: 'R2-DC-CORE', bw: '100 Gbps', util: 42, status: 'healthy' },
        { source: 'R1-HQ-CORE', target: 'FW-PA-5250', bw: '40 Gbps', util: 28, status: 'healthy' },
        { source: 'R2-DC-CORE', target: 'FW-PA-5250', bw: '40 Gbps', util: 35, status: 'healthy' },
        { source: 'R2-DC-CORE', target: 'GW-AWS-DC', bw: '10 Gbps', util: 68, status: 'healthy' },
        { source: 'R1-HQ-CORE', target: 'SW-DIST-01', bw: '25 Gbps', util: 18, status: 'healthy' },
        { source: 'R2-DC-CORE', target: 'SW-DIST-02', bw: '25 Gbps', util: 22, status: 'healthy' },
        { source: 'SW-DIST-01', target: 'SW-ACCESS-01', bw: '10 Gbps', util: 12, status: 'healthy' },
        { source: 'SW-DIST-02', target: 'SW-ACCESS-01', bw: '10 Gbps', util: 14, status: 'healthy' },
        { source: 'R1-HQ-CORE', target: 'SDWAN-EDGE', bw: '1 Gbps', util: 89, status: 'healthy' }
    ];

    // Animated Particles on Links
    const particles = [];
    links.forEach(link => {
        for (let i = 0; i < 3; i++) {
            particles.push({
                link: link,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.004
            });
        }
    });

    let draggedNode = null;
    let dragOffsetX = 0, dragOffsetY = 0;

    function resetLayout() {
        nodes.forEach(n => {
            n.x = n.px * width;
            n.y = n.py * height;
        });
    }

    document.getElementById('btn-reset-layout').addEventListener('click', resetLayout);

    function renderTopology() {
        ctx.clearRect(0, 0, width, height);

        // Draw Links
        links.forEach(link => {
            const src = nodes.find(n => n.id === link.source);
            const tgt = nodes.find(n => n.id === link.target);
            if (!src || !tgt) return;

            ctx.beginPath();
            ctx.moveTo(src.x, src.y);
            ctx.lineTo(tgt.x, tgt.y);
            
            if (link.status === 'critical') {
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 4;
                ctx.setLineDash([8, 6]);
            } else if (link.status === 'warning') {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 3;
                ctx.setLineDash([]);
            } else {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // Update & Draw Animated Particles
        particles.forEach(p => {
            const src = nodes.find(n => n.id === p.link.source);
            const tgt = nodes.find(n => n.id === p.link.target);
            if (!src || !tgt) return;

            p.progress += p.speed;
            if (p.progress > 1) p.progress = 0;

            const px = src.x + (tgt.x - src.x) * p.progress;
            const py = src.y + (tgt.y - src.y) * p.progress;

            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = p.link.status === 'critical' ? '#ef4444' : '#38bdf8';
            ctx.shadowColor = p.link.status === 'critical' ? '#ef4444' : '#38bdf8';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw Nodes
        nodes.forEach(node => {
            // Outer Glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
            if (node.status === 'critical') {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            } else if (node.status === 'warning') {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
            } else {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
            }
            ctx.fill();

            // Inner Core Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
            if (node.status === 'critical') {
                ctx.fillStyle = '#ef4444';
            } else if (node.status === 'warning') {
                ctx.fillStyle = '#f59e0b';
            } else {
                ctx.fillStyle = '#1e293b';
            }
            ctx.strokeStyle = node.status === 'healthy' ? '#3b82f6' : '#fff';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();

            // Node Labels
            ctx.font = '600 12px Inter, sans-serif';
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 32);

            ctx.font = '400 10px Fira Code, monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(node.ip, node.x, node.y + 46);
        });

        requestAnimationFrame(renderTopology);
    }
    renderTopology();

    // Mouse Dragging Physics Events
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        draggedNode = nodes.find(node => Math.hypot(mouseX - node.x, mouseY - node.y) <= 24);
        if (draggedNode) {
            dragOffsetX = mouseX - draggedNode.x;
            dragOffsetY = mouseY - draggedNode.y;
            openNodeInspector(draggedNode);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!draggedNode) return;
        const rect = canvas.getBoundingClientRect();
        draggedNode.x = e.clientX - rect.left - dragOffsetX;
        draggedNode.y = e.clientY - rect.top - dragOffsetY;
    });

    window.addEventListener('mouseup', () => {
        draggedNode = null;
    });

    const inspectorEl = document.getElementById('node-inspector');
    document.getElementById('btn-close-inspector').addEventListener('click', () => {
        inspectorEl.style.display = 'none';
    });

    function openNodeInspector(node) {
        document.getElementById('inspect-node-name').innerText = node.label;
        document.getElementById('inspect-type').innerText = node.type.toUpperCase();
        document.getElementById('inspect-vendor').innerText = node.vendor;
        document.getElementById('inspect-ip').innerText = node.ip;
        document.getElementById('inspect-cpu').innerText = `${node.cpu} / ${node.mem}`;

        const intContainer = document.getElementById('inspect-interfaces');
        intContainer.innerHTML = `
            <div class="int-item"><span>GigE0/0/0 (Uplink)</span><span style="color:#10b981;">UP / 10G</span></div>
            <div class="int-item"><span>TenGigE0/0/1 (Peer)</span><span style="${node.status === 'critical' ? 'color:#ef4444;' : 'color:#10b981;'}">${node.status === 'critical' ? 'DOWN (FLAP)' : 'UP / 10G'}</span></div>
            <div class="int-item"><span>Loopback0 (gNMI)</span><span style="color:#10b981;">10.255.255.${node.ip.split('.').pop()}</span></div>
        `;

        inspectorEl.style.display = 'block';
    }

    // ----------------------------------------------------------------------
    // 3. Complete Enterprise Failure Scenarios Data
    // ----------------------------------------------------------------------
    const scenarioScenarios = {
        bgp_loop: {
            title: "Incident #INC-8942: BGP Route Flapping & AS-Path Loop Detected",
            severity: "CRITICAL",
            nodeId: "R1-HQ-CORE",
            targetLink: { source: 'R1-HQ-CORE', target: 'SDWAN-EDGE' },
            rootCause: "Autonomous System AS-65001 received an advertised BGP prefix 172.16.0.0/16 containing its own AS in the path from peer 10.255.0.2 (R1-HQ-CORE), triggering BGP loop prevention drop and session teardown.",
            blastRadius: "12 Cloud Microservices offline. Multi-cloud traffic redirected via backup 1G WAN tunnel causing 45ms added latency.",
            steps: [
                "Apply AS-path filter on R1-HQ-CORE interface TenGigE0/0/1 to strip duplicate AS sequence.",
                "Execute soft BGP reset: clear ip bgp 10.255.0.2 soft in.",
                "Verify route table convergence via PyATS automated test runner."
            ],
            log: "[BGP-ERROR] %BGP-3-NOTIFICATION: sent to neighbor 10.255.0.2 (UPDATE Message Error - AS Path Loop)"
        },
        mtu_mismatch: {
            title: "Incident #INC-8943: OSPF MTU Mismatch & Neighbor Exchange Stuck in INIT/EXSTART",
            severity: "CRITICAL",
            nodeId: "SW-DIST-01",
            targetLink: { source: 'R1-HQ-CORE', target: 'SW-DIST-01' },
            rootCause: "Interface GigE0/0/1 on R1-HQ-CORE configured for Jumbo Frames (MTU 9000) while SW-DIST-01 interface configured for standard MTU 1500, causing DBD packet drops during OSPF exchange.",
            blastRadius: "Inter-VLAN routing failure between Core and Distribution switches. OSPF adjacencies failing.",
            steps: [
                "Align MTU sizes across interconnect interfaces to 9000 bytes.",
                "Or enable 'ip ospf mtu-ignore' as a temporary mitigation.",
                "Run automated ping test with DF-bit set to verify path MTU discovery."
            ],
            log: "[OSPF-WARN] %OSPF-5-ADJCHG: Process 100, Nbr 10.0.2.1 on GigE0/0/1 from EXSTART to DOWN, Neighbor Down: Too Many Retransmissions"
        },
        crc_storm: {
            title: "Incident #INC-8944: Optical SFP+ Signal Degradation & CRC Error Storm",
            severity: "WARNING",
            nodeId: "R2-DC-CORE",
            targetLink: { source: 'R2-DC-CORE', target: 'GW-AWS-DC' },
            rootCause: "Rx Optical Power level dropped to -18.2 dBm on interface TenGigE0/0/2 due to dirty fiber connector, causing 4,200 CRC drops/sec.",
            blastRadius: "AWS DirectConnect throughput degraded by 60%. TCP retransmissions spiked to 8.4%.",
            steps: [
                "Inspect DOM optical power levels via gNMI /components/component/transceiver/state/input-power.",
                "Failover AWS DirectConnect traffic to secondary BGP path.",
                "Clean optic transceiver interface during scheduled maintenance."
            ],
            log: "[INTERFACE-ERR] %LINK-4-ERROR: TenGigE0/0/2 Rx power low threshold breached (-18.2 dBm). High CRC Rate: 4210/s"
        },
        stp_root_flip: {
            title: "Incident #INC-8945: Rapid Spanning Tree (RSTP) Root Bridge Involuntary Re-election",
            severity: "CRITICAL",
            nodeId: "SW-ACCESS-01",
            targetLink: { source: 'SW-DIST-01', target: 'SW-ACCESS-01' },
            rootCause: "An unauthorized rogue switch was connected to SW-ACCESS-01 with Bridge Priority 0, hijacking the STP Root Bridge status from SW-DIST-01.",
            blastRadius: "L2 Topology TCN storm causing 15% MAC address table flushing per second across VLAN 100.",
            steps: [
                "Enable BPDU Guard and Root Guard on all Access Switch ports: 'spanning-tree guard root'.",
                "Statically enforce Root Priority 4096 on SW-DIST-01.",
                "Verify topology convergence via gNMI telemetry stream."
            ],
            log: "[STP-CRIT] %SPANTREE-2-ROOTCHANGE: Root switch changed to priority 0 ID 0001.c4a2.9011 on VLAN 100"
        },
        vxlan_evpn: {
            title: "Incident #INC-8946: VXLAN EVPN VNI Mapping Discrepancy & BFD Tunnel Drop",
            severity: "CRITICAL",
            nodeId: "FW-PA-5250",
            targetLink: { source: 'R1-HQ-CORE', target: 'FW-PA-5250' },
            rootCause: "VNI 50100 mapped to wrong VRF 'TENANT-B' on Spine Gateway FW-PA-5250, causing BGP EVPN Type-2 route rejection.",
            blastRadius: "Multi-tenant datacenter traffic blackholed across DC Fabric spine switches.",
            steps: [
                "Update NVE overlay interface configuration to align VNI 50100 to VRF 'TENANT-A'.",
                "Re-sync EVPN L2VPN route targets.",
                "Run automated BFD ping sweep across VTEPs."
            ],
            log: "[EVPN-ERR] %EVPN-3-VNI_MISMATCH: VNI 50100 route-target import failure from peer 10.0.1.1"
        }
    };

    let activeScenarioKey = 'bgp_loop';

    document.getElementById('btn-inject-scenario').addEventListener('click', () => {
        const scenarioKey = document.getElementById('scenario-select').value;
        injectScenario(scenarioKey);
    });

    document.getElementById('btn-simulate-issue').addEventListener('click', () => {
        injectScenario('bgp_loop');
    });

    document.getElementById('btn-reset-scenario').addEventListener('click', autoRemediateNetwork);
    document.getElementById('btn-execute-auto-fix').addEventListener('click', autoRemediateNetwork);

    function autoRemediateNetwork() {
        nodes.forEach(n => n.status = 'healthy');
        links.forEach(l => l.status = 'healthy');
        
        document.getElementById('health-score').innerText = '98.4%';
        document.getElementById('incident-chip').style.display = 'none';

        // Update RCA Card to Healthy State
        document.getElementById('rca-incident-name').innerText = "Network Fully Converged & Health Score Restored (98.4%)";
        document.getElementById('rca-root-cause').innerText = "All BGP neighbor adjacencies, OSPF MTUs, and optical power thresholds are operating within healthy enterprise parameters.";
        document.getElementById('rca-blast-radius').innerText = "Zero impacted microservices. Traffic routed across primary 100G links.";
        document.getElementById('rca-severity').className = "severity-tag healthy";
        document.getElementById('rca-severity').innerText = "HEALTHY";
        document.getElementById('rca-icon').className = "fa-solid fa-circle-check color-green";

        // Update SD-WAN SLA
        document.getElementById('sla-sdwan-latency').innerText = "14.2 ms";
        document.getElementById('sla-sdwan-latency').className = "metric-large green";
        document.getElementById('sla-sdwan-sub').innerText = "Jitter: 0.8ms | Packet Loss: 0.00% (Optimal)";
        document.getElementById('sdwan-sparkline').querySelectorAll('.bar').forEach(b => b.className = "bar");

        addLogLine('[SYSTEM] Auto-remediation executed. PyATS testbed verified 100% convergence.', 'success');
    }

    function injectScenario(key) {
        const scenario = scenarioScenarios[key] || scenarioScenarios.bgp_loop;
        activeScenarioKey = key;

        // Update Topology State
        nodes.forEach(n => {
            if (n.id === scenario.nodeId) n.status = 'critical';
        });

        links.forEach(l => {
            if ((l.source === scenario.targetLink.source && l.target === scenario.targetLink.target) ||
                (l.source === scenario.targetLink.target && l.target === scenario.targetLink.source)) {
                l.status = 'critical';
            }
        });

        // Update Header & Badge
        document.getElementById('health-score').innerText = '72.1%';
        document.getElementById('incident-chip').style.display = 'inline-flex';
        document.getElementById('active-alert-title').innerText = scenario.severity;

        // Update RCA Card
        document.getElementById('rca-incident-name').innerText = scenario.title;
        document.getElementById('rca-root-cause').innerText = scenario.rootCause;
        document.getElementById('rca-blast-radius').innerText = scenario.blastRadius;
        document.getElementById('rca-severity').className = "severity-tag critical";
        document.getElementById('rca-severity').innerText = "CRITICAL";
        document.getElementById('rca-icon').className = "fa-solid fa-triangle-exclamation color-red";
        
        const stepsEl = document.getElementById('rca-steps');
        stepsEl.innerHTML = scenario.steps.map(s => `<li>${s}</li>`).join('');

        // Append Log
        addLogLine(scenario.log, 'error');

        // Switch to AI View
        document.querySelector('.nav-menu li[data-view="ai-copilot"]').click();
        
        // Render Vendor Config
        updateVendorConfigs();
    }

    function addLogLine(text, level = 'info') {
        const consoleEl = document.getElementById('live-log-console');
        const div = document.createElement('div');
        div.className = `log-line ${level}`;
        div.innerText = text;
        consoleEl.appendChild(div);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    // ----------------------------------------------------------------------
    // 4. Multi-Vendor Configuration & Rollback Generator Data
    // ----------------------------------------------------------------------
    const vendorConfigs = {
        bgp_loop: {
            cisco_ios: {
                remediation: `! NetPulse AI Auto-Remediation Script (Cisco IOS-XE)
! Target Device: R1-HQ-CORE (10.0.0.1)
! Incident: BGP AS-Path Loop Mitigation

router bgp 65001
 neighbor 10.255.0.2 remote-as 65001
 neighbor 10.255.0.2 route-map RM-STRIP-AS-LOOP in
!
ip as-path access-list 10 permit ^65001_
!
route-map RM-STRIP-AS-LOOP permit 10
 match as-path 10
 set as-path prepend 65001 65001
!
end
write memory
clear ip bgp 10.255.0.2 soft in`,
                rollback: `! NetPulse AI Rollback Script (Cisco IOS-XE)
router bgp 65001
 no neighbor 10.255.0.2 route-map RM-STRIP-AS-LOOP in
!
no route-map RM-STRIP-AS-LOOP
no ip as-path access-list 10
end
clear ip bgp 10.255.0.2 soft in`
            },
            arista_eos: {
                remediation: `! NetPulse AI Remediation (Arista EOS)
router bgp 65001
 neighbor 10.255.0.2 remote-as 65001
 neighbor 10.255.0.2 route-map RM-STRIP-AS-LOOP in
!
route-map RM-STRIP-AS-LOOP permit 10
 match as-path 10
!
ip as-path access-list 10 permit ^65001_`,
                rollback: `! NetPulse AI Rollback (Arista EOS)
router bgp 65001
 no neighbor 10.255.0.2 route-map RM-STRIP-AS-LOOP in`
            },
            juniper_junos: {
                remediation: `# NetPulse AI Remediation (Juniper Junos)
set policy-options policy-statement AS-STRIP term 1 from as-path AS-65001
set policy-options policy-statement AS-STRIP term 1 then accept
set protocols bgp group IBGP neighbor 10.255.0.2 import AS-STRIP
commit check
commit comment "NetPulse AI Fix"`,
                rollback: `# NetPulse AI Rollback (Juniper Junos)
delete protocols bgp group IBGP neighbor 10.255.0.2 import AS-STRIP
commit`
            },
            palo_alto: {
                remediation: `# Palo Alto PAN-OS CLI Remediation
set network virtual-router default protocol bgp peer-group IBGP peer R1-HQ-CORE remove-private-as yes
commit`,
                rollback: `# Palo Alto PAN-OS Rollback
set network virtual-router default protocol bgp peer-group IBGP peer R1-HQ-CORE remove-private-as no
commit`
            }
        },
        mtu_mismatch: {
            cisco_ios: {
                remediation: `! Cisco IOS-XE MTU Remediation
interface GigE0/0/1
 mtu 9000
 ip ospf mtu-ignore
end
write memory`,
                rollback: `! Cisco IOS-XE Rollback
interface GigE0/0/1
 mtu 1500
 no ip ospf mtu-ignore
end`
            },
            arista_eos: {
                remediation: `! Arista EOS MTU Remediation
interface Ethernet1/1
 mtu 9000
end`,
                rollback: `! Arista EOS Rollback
interface Ethernet1/1
 mtu 1500
end`
            }
        }
    };

    let selectedVendor = 'cisco_ios';

    document.querySelectorAll('.vendor-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.vendor-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedVendor = btn.getAttribute('data-vendor');
            updateVendorConfigs();
        });
    });

    function updateVendorConfigs() {
        const scenarioConfig = vendorConfigs[activeScenarioKey] || vendorConfigs.bgp_loop;
        const vendorData = scenarioConfig[selectedVendor] || scenarioConfig.cisco_ios;

        document.getElementById('code-remediation').innerText = vendorData.remediation || "// Config template loading...";
        document.getElementById('code-rollback').innerText = vendorData.rollback || "// Rollback template loading...";
    }
    updateVendorConfigs();

    document.getElementById('btn-apply-remediation').addEventListener('click', () => {
        document.querySelector('.nav-menu li[data-view="config-generator"]').click();
    });

    // Copy Buttons
    document.getElementById('btn-copy-config').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('code-remediation').innerText);
        alert('Cisco / Vendor Remediation configuration copied to clipboard!');
    });

    document.getElementById('btn-copy-rollback').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('code-rollback').innerText);
        alert('Automated Rollback script copied to clipboard!');
    });

    // ----------------------------------------------------------------------
    // 5. DPI Packet Inspector & Hex Dump Viewer
    // ----------------------------------------------------------------------
    const packets = [
        { no: 1, time: '0.000000', src: '10.0.0.1', dst: '10.255.0.2', proto: 'BGP', len: 85, info: 'KEEPALIVE Message', hex: '0000  ffff ffff ffff ffff ffff ffff ffff ffff  ................\n0010  00 13 04                                 ...' },
        { no: 2, time: '0.142105', src: '10.255.0.2', dst: '10.0.0.1', proto: 'gNMI', len: 240, info: 'SubscribeResponse: Path=/components/interface[TenGigE0/0/1]/state/crc-errors', hex: '0000  08 00 27 c4 a2 90 00 1b 54 00 12 34 08 00 45 00  ..'......T..4..E.\n0010  00 f0 42 a1 40 00 40 06 88 12 0a 00 00 01 0a ff  ..B.@.@.........' },
        { no: 3, time: '0.285112', src: '10.255.0.2', dst: '10.0.0.1', proto: 'BGP', len: 124, info: 'UPDATE Message - Withdraw: 172.16.0.0/16, AS-Path: 65001 65001', hex: '0000  00 1c 73 00 00 99 00 1b 54 00 12 34 08 00 45 00  ..s.....T..4..E.\n0010  00 7c 3a f1 40 00 40 06 91 d2 0a 00 00 01 0a ff  .|:.@.@.........\n0020  00 02 e0 38 00 00 00 00 00 01 00 00 00 01 02 00  ...8............' },
        { no: 4, time: '0.412090', src: '10.0.0.1', dst: '10.0.0.2', proto: 'OSPF', len: 76, info: 'LS Update (Type 1 Router LSA)', hex: '0000  01 00 5e 00 00 05 00 1c 73 00 00 99 08 00 45 c0  ..^.....s.....E.\n0010  00 4c 1a b2 00 00 01 59 e2 1a 0a 00 00 01 224 0  .L.....Y......"' },
        { no: 5, time: '0.529810', src: '192.168.100.1', dst: '10.0.0.1', proto: 'TCP', len: 66, info: '57400 -> 48212 [ACK] Seq=1421 Ack=892 Win=65535', hex: '0000  00 1b 54 00 12 34 00 1c 73 00 00 99 08 00 45 00  ..T..4..s.....E.\n0010  00 42 e1 90 40 00 40 06 db 12 c0 a8 64 01 0a 00  .B..@.@.....d...' }
    ];

    const packetBody = document.getElementById('packet-table-body');
    packets.forEach(p => {
        const tr = document.createElement('tr');
        if (p.no === 3) tr.className = 'selected';
        tr.innerHTML = `
            <td>${p.no}</td>
            <td>${p.time}</td>
            <td>${p.src}</td>
            <td>${p.dst}</td>
            <td><strong>${p.proto}</strong></td>
            <td>${p.len}</td>
            <td>${p.info}</td>
        `;
        tr.addEventListener('click', () => {
            document.querySelectorAll('.packet-table tr').forEach(r => r.classList.remove('selected'));
            tr.classList.add('selected');
            renderPacketDetail(p);
        });
        packetBody.appendChild(tr);
    });

    function renderPacketDetail(p) {
        document.getElementById('selected-frame-no').innerText = p.no;
        document.getElementById('hex-dump-code').innerText = p.hex;
        
        const treeEl = document.getElementById('protocol-tree');
        treeEl.innerHTML = `
            <div class="tree-node">▸ Frame ${p.no}: ${p.len} bytes on wire, ${p.len * 8} bits captured</div>
            <div class="tree-node">▸ Ethernet II, Src: Cisco_a2:4f:11, Dst: Arista_b8:19:92</div>
            <div class="tree-node">▸ Internet Protocol Version 4, Src: ${p.src}, Dst: ${p.dst}</div>
            <div class="tree-node">
                <strong>▾ Protocol Details - ${p.proto}</strong>
                <div class="tree-node">Marker: 16 bytes (ffffffffffffffffffffffffffffffff)</div>
                <div class="tree-node">Captured Length: ${p.len} bytes</div>
                <div class="tree-node">Summary Payload: ${p.info}</div>
            </div>
        `;
    }
    renderPacketDetail(packets[2]);

    // ----------------------------------------------------------------------
    // 6. Interactive AI Agent Chat
    // ----------------------------------------------------------------------
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');

    document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    function sendChatMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Message
        const userDiv = document.createElement('div');
        userDiv.className = 'message user';
        userDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-user"></i></div>
            <div class="content"><p>${text}</p></div>
        `;
        chatMessages.appendChild(userDiv);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Smart NetOps AI Responses
        setTimeout(() => {
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai';
            let responseHtml = "";

            if (text.toLowerCase().includes("mtu")) {
                responseHtml = `<p><strong>OSPF MTU Analysis:</strong> When interface MTU sizes differ between peers (e.g. 9000 vs 1500 bytes), OSPF adjacencies get stuck in <code>EXSTART/EXCHANGE</code> states. Align interface MTUs or configure <code>ip ospf mtu-ignore</code> on Cisco IOS-XE.</p>`;
            } else if (text.toLowerCase().includes("bgp")) {
                responseHtml = `<p><strong>BGP Telemetry Insight:</strong> BGP neighbor <code>10.255.0.2</code> (AS 65001) is currently established. If route flapping occurs, apply an AS-path access list and run soft reset <code>clear ip bgp soft in</code>.</p>`;
            } else {
                responseHtml = `<p>I evaluated telemetry for <code>"${text}"</code> against your gNMI telemetry stream. Interface counters show normal packet flow. You can run automated intent validation using our Batfish integration in the backend!</p>`;
            }

            aiDiv.innerHTML = `
                <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="content">${responseHtml}</div>
            `;
            chatMessages.appendChild(aiDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 600);
    }
});

import axios from 'axios';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

function BASE() {
  return `https://${process.env.PROXMOX_HOST}:${process.env.PROXMOX_PORT}/api2/json`;
}

let ticket = null;
let ticketExpiry = 0;

async function authenticate() {
  if (ticket && Date.now() < ticketExpiry) return ticket;
  const res = await axios.post(
    `${BASE()}/access/ticket`,
    new URLSearchParams({
      username: process.env.PROXMOX_USER,
      password: process.env.PROXMOX_PASS,
    }),
    { httpsAgent: agent }
  );
  ticket = res.data.data;
  ticketExpiry = Date.now() + 1000 * 60 * 90; // 90 min
  return ticket;
}

async function pveGet(path) {
  const auth = await authenticate();
  const res = await axios.get(`${BASE()}${path}`, {
    httpsAgent: agent,
    headers: { Cookie: `PVEAuthCookie=${auth.ticket}` },
  });
  return res.data.data;
}

// Service web UI links
const SERVICE_LINKS = {
  adguard: 'http://192.168.0.141',
  uptimekuma: 'http://192.168.0.216:3001',
  'plex-ubuntu': 'http://192.168.0.185:32400/web',
  portainer: 'http://192.168.0.113:9000',
  'baby-tracker-api': 'http://192.168.0.114:3000',
  'build-server': 'http://192.168.0.168',
  truenas: 'http://192.168.0.154',
  yams: 'http://192.168.0.170',
};

export async function getProxmoxData() {
  const node = process.env.PROXMOX_NODE;

  const [nodeStatus, resources] = await Promise.all([
    pveGet(`/nodes/${node}/status`),
    pveGet('/cluster/resources?type=vm'),
  ]);

  const vms = resources.map((vm) => {
    const nameKey = vm.name?.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return {
      id: vm.vmid,
      name: vm.name,
      type: vm.type, // qemu or lxc
      status: vm.status,
      tags: vm.tags ? vm.tags.split(';').filter(Boolean) : [],
      cpu: vm.cpu ?? 0,
      cpuMax: vm.maxcpu,
      mem: vm.mem ?? 0,
      memMax: vm.maxmem,
      disk: vm.disk ?? 0,
      diskMax: vm.maxdisk,
      uptime: vm.uptime ?? 0,
      netin: vm.netin ?? 0,
      netout: vm.netout ?? 0,
      template: vm.template === 1,
      link: SERVICE_LINKS[nameKey] || null,
    };
  });

  return {
    node: {
      name: node,
      cpu: nodeStatus.cpu,
      cpuCores: nodeStatus.cpuinfo?.cpus,
      cpuModel: nodeStatus.cpuinfo?.model,
      mem: nodeStatus.memory?.used,
      memTotal: nodeStatus.memory?.total,
      memFree: nodeStatus.memory?.free,
      disk: nodeStatus.rootfs?.used,
      diskTotal: nodeStatus.rootfs?.total,
      diskFree: nodeStatus.rootfs?.free,
      uptime: nodeStatus.uptime,
      loadAvg: nodeStatus.loadavg,
      pveVersion: nodeStatus.pveversion,
    },
    vms: vms.filter((v) => !v.template),
  };
}

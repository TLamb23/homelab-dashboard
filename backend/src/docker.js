import axios from 'axios';

const DOCKER_IP = process.env.DOCKER_LXC_IP;

export async function getDockerData() {
  // Docker remote API via TCP — needs to be enabled on the LXC
  // Falls back to empty if not available
  try {
    const res = await axios.get(`http://${DOCKER_IP}:2375/containers/json?all=true`, {
      timeout: 5000,
    });
    return res.data.map((c) => ({
      id: c.Id.slice(0, 12),
      name: c.Names[0]?.replace(/^\//, ''),
      image: c.Image,
      status: c.Status,
      state: c.State,
      created: c.Created,
    }));
  } catch {
    // Docker TCP not exposed — return null, frontend will handle gracefully
    return null;
  }
}

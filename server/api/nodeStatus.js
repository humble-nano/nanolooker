/*const fs = require("fs");
const os = require("os");
const find = require("find-process");
const pidusage = require("pidusage");*/
const { nodeCache } = require("../client/cache");
const { Sentry } = require("../sentry");
const { NODE_STATUS, EXPIRE_1M } = require("../constants");

const getNodeStatus = async () => {
  let nodeStatus = nodeCache.get(NODE_STATUS);

  if (!nodeStatus) {
    try {
      /*const [{ pid }] = await find("name", "nano_node");

      if (!pid) return { nodeStatus: {} };

      const { cpu, memory, elapsed } = await pidusage(pid);
      const { size: ledgerSize } = fs.statSync(`${process.env.NODE_FOLDER}/data.ldb`);

      nodeStatus = {
        memory: {
          free: os.freemem(),
          total: os.totalmem(),
        },
        cpu: os.cpus(),
        ledgerSize,
        nodeStats: {
          cpu,
          memory,
          elapsed,
        },
      };*/

      nodeStatus = {
        memory: {
          free: 0,
          total: 0,
        },
        cpu: 0,
        ledgerSize: 0,
        nodeStats: {
          cpu: 0,
          memory: 0,
          elapsed: 0,
        },
      };

      nodeCache.set(NODE_STATUS, nodeStatus, EXPIRE_1M / 2);
    } catch (err) {
      console.log("Error", err);
      Sentry.captureException(err);
    }
  }

  return { nodeStatus };
};

module.exports = {
  getNodeStatus,
  NODE_STATUS,
};

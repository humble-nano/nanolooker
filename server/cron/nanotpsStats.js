const cron = require("node-cron");
const fetch = require("node-fetch");
const { Sentry } = require("../sentry");
const { nodeCache } = require("../client/cache");
const { NANOTPS_STATS } = require("../constants");

const doNanoTpsStats = async () => {
  let res;

  try {
    const res = await fetch("https://tps.bnano.info/api/data/prod");

    const { send: sends, receive: receives, change: changes } = await res.json();

    let send = sends[sends.length - 1];
    let receive = receives[receives.length - 1];
    let change = changes[changes.length - 1];

    const stats = { send, receive, change };

    nodeCache.set(NANOTPS_STATS, stats);
  } catch (err) {
    console.err(err);
    Sentry.captureException(err, { extra: { res } });
  }
};

// https://crontab.guru/every-1-hour
cron.schedule("0 * * * *", async () => {
  doNanoTpsStats();
});

if (process.env.NODE_ENV === "production") {
  doNanoTpsStats();
}

doNanoTpsStats();

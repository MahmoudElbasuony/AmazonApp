const { Pool } = require("pg");
const { Logger: logger } = require("../cross-cutting/utils");
const config = require("../cross-cutting/config");

module.exports = function Db() {
  const pool = new Pool(config.db);
  const queryManager = {};
  queryManager.query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info("executed query", { text, duration, rows: res.rowCount });
    return res;
  };
  queryManager.getClient = async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      logger.error("A client has been checked out for more than 5 seconds!");
      logger.error(
        `The last executed query on this client was: ${client.lastQuery}`
      );
    }, 5000);
    // monkey patch the query method to keep track of the last query executed
    client.query = async (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };
    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    return client;
  };
  queryManager.executeInTransaction = async (queries, params = []) => {
    if (!queries) return;
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(queries, params);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  };
  queryManager.Product = require("./product")(queryManager);

  process.on("beforeExit", (_) => {
    pool.end();
  });
  
  return queryManager;
};

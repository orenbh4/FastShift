let appPromise;

module.exports = async function handler(req, res) {
  appPromise ||= import("../server.js").then((module) => module.default);
  const app = await appPromise;
  return app(req, res);
};

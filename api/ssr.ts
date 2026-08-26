type StartServer = {
  default: {
    fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
  };
};

export default async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get("path");

  if (path !== null) {
    url.pathname = `/${path}`.replace(/\/+/g, "/");
    url.searchParams.delete("path");
  }

  const appRequest = new Request(url, request);
  const server = (await import("../dist/server/server.js")) as StartServer;

  return server.default.fetch(appRequest, {}, {});
}

export const setupStreamHeaders = (
  res
) => {
  res.setHeader(
    "Content-Type",
    "text/plain; charset=utf-8"
  );

  res.setHeader(
    "Transfer-Encoding",
    "chunked"
  );

  res.setHeader(
    "Cache-Control",
    "no-cache"
  );

  res.setHeader(
    "Connection",
    "keep-alive"
  );
};

export const sendStreamChunk = (
  res,
  chunk
) => {
  res.write(chunk);
};

export const endStream = (res) => {
  res.end();
};
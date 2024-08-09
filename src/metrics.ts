import express, { Request, Response } from "express";
import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 5, 10],
});

export const requestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Database Query Duration
export const dbQueryDuration = new client.Histogram({
  name: "db_query_duration_ms",
  help: "Duration of database queries in ms",
  labelNames: ["query_type"],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

export const dbQueriesTotal = new client.Counter({
  name: "db_queries_total",
  help: "Total number of database queries",
  labelNames: ["query_type"],
});

export const metricsMiddleware = (req: Request, res: Response, next: any) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.originalUrl,
      status_code: res.statusCode,
    });
  });
  requestCount.inc({
    method: req.method,
    route: req.route ? req.route.path : req.originalUrl,
    status_code: res.statusCode,
  });
  next();
};

export const getMetrics = async (req: any, res: any) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};

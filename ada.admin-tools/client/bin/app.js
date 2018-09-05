"use strict";

const express   = require("express");
const path      = require("path");
const logger    = require("morgan");

class Server
{
	static create()
	{
		return new Server();
	}

	constructor()
	{
		this.m_app = express();
		this.loadConfig();
		this.loadRoutes();
	}

	get app()
	{
		return this.m_app;
	}

	loadConfig()
	{
		this.m_app.use(logger("dev"));

		this.m_app.use(express.static(path.join(__dirname, "../build")));

		this.m_app.use((err, req, res, next) =>
		{
			err.status = 404;
			next(err);
		});

		process.on("uncaughtException", (err) =>
		{
			console.error("uncaughtException: " + err.stack);
		});
	}

	loadRoutes()
	{
		this.m_app.get("*", (req, res, next) => {
			res.sendFile(path.join(__dirname, "../build/index.html"));
		});
	}
}

module.exports = (Server.create()).app;
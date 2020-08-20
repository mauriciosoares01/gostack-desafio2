const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateRequestId(request, response, next) {
	const { id } = request.params;

	if (!isUuid(id)) {
		return response.status(400).send({ error: "Invalid request id" });
	}

	return next();
}

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRequestId);

const repositories = [];

app.get("/repositories", (request, response) => {
	return response.json(repositories);
});

app.post("/repositories", (request, response) => {
	const { title, url, techs } = request.body;

	const repositorie = { id: uuid(), title, url, techs, likes: 0 };

	repositories.push(repositorie);

	return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
	const { id } = request.params;
	const { title, url, techs } = request.body;

	const repositorie = { id, title, url, techs };

	const repositorieIndex = repositories.findIndex(
		(repository) => repository.id === id
	);

	if (repositorieIndex < 0) {
		return response.status(400).send({ error: "Invalid repositorie" });
	}

	const { likes } = repositories[repositorieIndex];
	repositories[repositorieIndex] = { ...repositorie, likes };

	return response.json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
	const { id } = request.params;

	const repositorieIndex = repositories.findIndex(
		(repository) => repository.id === id
	);

	if (repositorieIndex < 0) {
		return response.status(400).send({ error: "Invalid repositorie" });
	}

	repositories.splice(repositorieIndex, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
	const { id } = request.params;

	const repositorieIndex = repositories.findIndex(
		(repository) => repository.id === id
	);

	if (repositorieIndex < 0) {
		return response.status(400).send({ error: "Invalid repositorie" });
	}

	const { likes } = repositories[repositorieIndex];
	repositories[repositorieIndex] = {
		...repositories[repositorieIndex],
		likes: likes + 1,
	};

	return response.json({ likes: likes + 1, id });
});

module.exports = app;

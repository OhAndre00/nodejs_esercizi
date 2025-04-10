import { Request, Response } from "express";
import Joi from "joi";
import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:andrea@localhost:5432/psql_1");

const setupDb = async () => {
  await db.none(`
      DROP TABLE IF EXISTS planets;

      CREATE TABLE planets (
        id SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Jupiter')`);
};
setupDb();

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    Number(id)
  );
  if (planet !== undefined) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validateNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    res.status(201).json({ msg: "The planet was created" });
  }
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const planets = await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [
    id,
    name,
  ]);
  if (planets !== undefined) {
    res.status(200).json({ msg: "The planet was updated" });
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planets = await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  if (planets !== undefined) {
    res.status(200).json({ msg: "The planet was deleted" });
  } else {
    res.status(404).json({ msg: "Planet not found" });
  }
};

export { getAll, getOneById, create, updateById, deleteById };

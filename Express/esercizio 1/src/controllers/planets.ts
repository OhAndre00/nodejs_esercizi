import { Request, Response } from "express";
import Joi from "joi";
import { db } from "./../db.js";

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const getRoute = async (req: Request, res: Response) => {
  res.send("API Planets");
};

const getAll = async (req: Request, res: Response) => {
  const planets = await db.manyOrNone(`SELECT * FROM planets;`);
  if (planets.length) {
    res.status(200).json(planets);
  } else {
    res.status(404).json({ msg: "Planets not found" });
  }
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

const createImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fileName = req.file?.path;

  if (fileName) {
    db.none("UPDATE planets SET image=$2 WHERE id=$1", [id, fileName]);
    res.status(201).json({ msg: "Planet image uploaded successfully" });
  } else {
    res.status(400).json({ msg: "Planet image failed to upload" });
  }
};

export {
  db,
  getRoute,
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
};

import * as moviesServices from "../services/moviesServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

import { movieAddSchema, movieUpdateSchema } from "../schemas/moviesSchemas.js";

const getAll = async (req, res) => {
    const result = await moviesServices.getAllMovies();

    res.json(result);
}

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await moviesServices.getMovieById(id);
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    res.json(result);
}

const add = async (req, res) => {
    const result = await moviesServices.addMovies(req.body);

    res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const result = await moviesServices.updateMovieById(id, req.body);
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    res.json(result);
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const result = await moviesServices.deleteMovieById(id);
    if (!result) {
        throw HttpError(404, `Movie with id=${id} not found`);
    }

    // res.status(204).send();

    res.json({
        message: "Delete success"
    });
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}
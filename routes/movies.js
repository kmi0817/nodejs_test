import express from 'express';

import { postMovie, getMovies, getMovie, deleteMovie, patchMovie } from '../controllers/movies.js';

const router = express.Router();

/* 모든 루트는 /movies 로 시작하므로, 그걸 제외한 루트부터 적어야 한다. */
router.get('/', getMovies);

router.get('/:id', getMovie);

router.post('/', postMovie);

router.delete('/:id', deleteMovie);

router.patch('/:id', patchMovie);

export default router; // we can use of it in the index.js

import { getAllPostsHandler } from './getAllPostsHandler';
import { getPostByIDHandler } from './getPostByIDHandler';
import { deletePostByIDHandler } from './deletePostByIDHandler';
import { createPostHandler } from './createPostHandler';
import { updatePostByIDHandler } from './updatePostByIDHandler';
import { getAllCommentsByPostIDHandler } from './getAllCommentsByPostIDHandler';
import { createCommentByPostIDHandler } from './createCommentByPostIDHandler';

export {
    getAllPostsHandler,
    getAllCommentsByPostIDHandler,
    getPostByIDHandler,
    deletePostByIDHandler,
    createPostHandler,
    createCommentByPostIDHandler,
    updatePostByIDHandler,
};

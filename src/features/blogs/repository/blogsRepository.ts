import { db } from '../../../database';
import type { CreateUpdateBlogInputModel, BlogViewModel } from '../models';

export const blogsRepository = {
    findAllBlogs: () => db.blogs,
    findBlogById: (id: string) => db.blogs.find(blog => blog.id === id),
    mapRequestedPayloadToViewModel: (payload: CreateUpdateBlogInputModel): BlogViewModel => ({
        id: (+new Date()).toString(),
        description: payload.description,
        name: payload.name,
        websiteUrl: payload.websiteUrl,
    }),
    addBlog: (blog: BlogViewModel) => db.blogs.push(blog),
    updateBlog: (existedBlog: BlogViewModel, payload: CreateUpdateBlogInputModel) => {
        const index = db.blogs.findIndex(blog => blog.id === existedBlog.id);
        db.blogs.splice(index, 1, { ...existedBlog, ...payload });
    },
    deleteBlogById: (id: string) => {
        const index = db.blogs.findIndex(blog => blog.id === id);
        db.blogs.splice(index, 1);
    },
};

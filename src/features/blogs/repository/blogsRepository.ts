import { BlogModel, TBlog } from '../domain';
import type { CreateUpdateBlogInputModel } from '../models';

export const blogsRepository = {
    async getBlogById(id: string) {
        return BlogModel.findById(id).lean();
    },
    async createBlog(newBlog: TBlog) {
        return BlogModel.create(newBlog);
    },
    async updateBlog(id: string, payload: CreateUpdateBlogInputModel) {
        return BlogModel.findByIdAndUpdate(id, payload, { lean: true, new: true });
    },
    async deleteBlogById(id: string) {
        return BlogModel.findByIdAndDelete(id).lean();
    },
};

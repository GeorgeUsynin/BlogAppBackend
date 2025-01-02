import { BlogsRepository } from '../repository';
import type { CreateUpdateBlogInputModel } from '../models';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { TBlog } from './blogEntity';

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async createBlog(payload: CreateUpdateBlogInputModel) {
        const { description, name, websiteUrl } = payload;

        const newBlog = new TBlog({
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        });

        return this.blogsRepository.createBlog(newBlog);
    }

    async updateBlog(blogId: string, payload: CreateUpdateBlogInputModel) {
        const updatedBlog = await this.blogsRepository.updateBlog(blogId, payload);

        if (!updatedBlog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        return updatedBlog;
    }

    async deleteBlogById(blogId: string) {
        const foundBlog = await this.blogsRepository.deleteBlogById(blogId);

        if (!foundBlog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }
    }
}

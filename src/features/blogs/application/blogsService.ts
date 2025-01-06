import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../infrastructure';
import type { CreateUpdateBlogInputDTO } from '../application';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { TBlog } from '../domain';

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

    async createBlog(payload: CreateUpdateBlogInputDTO) {
        const newBlog = new TBlog(payload);

        return this.blogsRepository.createBlog(newBlog);
    }

    async updateBlog(blogId: string, payload: CreateUpdateBlogInputDTO) {
        const { description, name, websiteUrl } = payload;

        const foundBlog = await this.blogsRepository.findBlogById(blogId);

        if (!foundBlog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        foundBlog.name = name;
        foundBlog.description = description;
        foundBlog.websiteUrl = websiteUrl;

        await this.blogsRepository.save(foundBlog);
    }

    async deleteBlogById(blogId: string) {
        const foundBlog = await this.blogsRepository.findBlogById(blogId);

        if (!foundBlog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        foundBlog.isDeleted = true;

        await this.blogsRepository.save(foundBlog);
    }
}

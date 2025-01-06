import { inject, injectable } from 'inversify';
import { PostsRepository } from '../infrastructure';
import { BlogsRepository } from '../../blogs/infrastructure';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { TPost } from '../domain/postEntity';
import { CreateUpdatePostInputDTO } from './dto';

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {}

    async createPost(payload: CreateUpdatePostInputDTO) {
        const { blogId, content, shortDescription, title } = payload;
        const linkedBlogName = (await this.blogsRepository.findBlogById(blogId))?.name as string;
        const newPost = new TPost({
            title,
            shortDescription,
            content,
            blogId,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        });

        return this.postsRepository.createPost(newPost);
    }

    async createPostByBlogId(payload: CreateUpdatePostInputDTO, blogId: string) {
        const blog = await this.blogsRepository.findBlogById(blogId);

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        return this.createPost({ ...payload, blogId });
    }

    async updatePost(postId: string, payload: CreateUpdatePostInputDTO) {
        const updatedPost = await this.postsRepository.updatePost(postId, payload);

        if (!updatedPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        return updatedPost;
    }

    async deletePostById(postId: string) {
        const deletedPost = await this.postsRepository.deletePostById(postId);

        if (!deletedPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }
    }
}

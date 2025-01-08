import { inject, injectable } from 'inversify';
import { PostsRepository } from '../infrastructure';
import { BlogsRepository } from '../../blogs/infrastructure';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { PostModel } from '../domain/postEntity';
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
        const newPost = new PostModel({
            title,
            shortDescription,
            content,
            blogId,
            blogName: linkedBlogName,
        });

        return this.postsRepository.save(newPost);
    }

    async createPostByBlogId(payload: CreateUpdatePostInputDTO) {
        const { blogId } = payload;
        const blog = await this.blogsRepository.findBlogById(blogId);

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        return this.createPost(payload);
    }

    async updatePost(postId: string, payload: CreateUpdatePostInputDTO) {
        const { blogId, content, shortDescription, title } = payload;

        const foundPost = await this.postsRepository.findPostById(postId);

        if (!foundPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        foundPost.blogId = blogId;
        foundPost.content = content;
        foundPost.shortDescription = shortDescription;
        foundPost.title = title;

        await this.postsRepository.save(foundPost);
    }

    async deletePostById(postId: string) {
        const foundPost = await this.postsRepository.findPostById(postId);

        if (!foundPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        foundPost.isDeleted = true;

        await this.postsRepository.save(foundPost);
    }
}

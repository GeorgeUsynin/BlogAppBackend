import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../users/infrastructure';
import { CommentsRepository } from '../infrastructure';
import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { CommentModel } from '../domain/commentEntity';
import { PostsRepository } from '../../posts/infrastructure';
import { CreateUpdateCommentInputDTO } from './dto';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository
    ) {}

    async createCommentByPostId(payload: CreateUpdateCommentInputDTO, postId: string, userId: string) {
        const { content } = payload;
        const post = await this.postsRepository.findPostById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        const user = await this.usersRepository.findUserById(userId);

        const newComment = new CommentModel({
            content,
            commentatorInfo: { userId, userLogin: user?.login as string },
            postId,
        });

        return await this.commentsRepository.save(newComment);
    }

    async updateCommentById(commentId: string, userId: string, payload: CreateUpdateCommentInputDTO) {
        const { content } = payload;
        const foundComment = await this.commentsRepository.findCommentById(commentId);

        if (!foundComment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment was not found',
            });
        }

        if (foundComment.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to update this comment',
            });
        }

        foundComment.content = content;

        await this.commentsRepository.save(foundComment);
    }

    async deleteCommentById(commentId: string, userId: string) {
        const foundComment = await this.commentsRepository.findCommentById(commentId);

        if (!foundComment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment was not found',
            });
        }

        if (foundComment.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to delete this comment',
            });
        }

        foundComment.isDeleted = true;

        await this.commentsRepository.save(foundComment);
    }
}

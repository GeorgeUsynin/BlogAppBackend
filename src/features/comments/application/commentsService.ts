import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../users/infrastructure';
import { CommentsRepository } from '../infrastructure';
import { LikeStatus, ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { TComment } from '../domain/commentEntity';
import { PostsRepository } from '../../posts/infrastructure';
import { LikesRepository } from '../../likes/infrastructure';
import { CreateUpdateCommentInputDTO } from './dto';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(LikesRepository) private likesRepository: LikesRepository
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

        const newComment = new TComment({
            content,
            commentatorInfo: { userId, userLogin: user?.login as string },
            postId,
        });

        return await this.commentsRepository.createComment(newComment);
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

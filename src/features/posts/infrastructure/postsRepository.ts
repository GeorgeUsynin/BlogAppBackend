import { injectable } from 'inversify';
import { PostDocument, PostModel, TPost } from '../domain';

@injectable()
export class PostsRepository {
    async findPostById(id: string) {
        return PostModel.findById(id);
    }

    async save(post: PostDocument) {
        return post.save();
    }
}

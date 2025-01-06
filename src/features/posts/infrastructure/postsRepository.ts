import { injectable } from 'inversify';
import { PostModel, TPost } from '../domain';
import { CreateUpdatePostInputDTO } from '../application';

@injectable()
export class PostsRepository {
    async createPost(newPost: TPost) {
        return PostModel.create(newPost);
    }

    async findPostById(id: string) {
        return PostModel.findById(id);
    }

    async updatePost(id: string, payload: CreateUpdatePostInputDTO) {
        return PostModel.findByIdAndUpdate(id, payload, { lean: true, new: true });
    }

    async deletePostById(id: string) {
        return PostModel.findByIdAndDelete(id);
    }
}

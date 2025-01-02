import { PostModel, TPost } from '../domain';
import { CreateUpdatePostInputModel } from '../models';

export class PostsRepository {
    async createPost(newPost: TPost) {
        return PostModel.create(newPost);
    }

    async findPostById(id: string) {
        return PostModel.findById(id);
    }

    async updatePost(id: string, payload: CreateUpdatePostInputModel) {
        return PostModel.findByIdAndUpdate(id, payload, { lean: true, new: true });
    }

    async deletePostById(id: string) {
        return PostModel.findByIdAndDelete(id);
    }
}

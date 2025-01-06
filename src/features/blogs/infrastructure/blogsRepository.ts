import { injectable } from 'inversify';
import { BlogDocument, BlogModel, TBlog } from '../domain';

@injectable()
export class BlogsRepository {
    async findBlogById(id: string) {
        return BlogModel.findById(id);
    }

    async createBlog(blog: TBlog) {
        return BlogModel.create(blog);
    }

    async save(blog: BlogDocument) {
        return blog.save();
    }
}

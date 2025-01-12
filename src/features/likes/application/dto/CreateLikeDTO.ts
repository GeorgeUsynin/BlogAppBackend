export type CreateLikeDTO = {
    parentId: string;
    userId: string;
    status: 'Like' | 'Dislike';
};

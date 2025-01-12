export type CreateCommentDTO = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    postId: string;
};

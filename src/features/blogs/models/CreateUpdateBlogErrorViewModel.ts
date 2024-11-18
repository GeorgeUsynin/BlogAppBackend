/**
 * Represents an error message for a specific field in the input model.
 */
type TError = {
    /**
     * The error message explaining why the validation for a certain field failed.
     * @type {string|null}
     * @nullable
     */
    message: string | null;
    /**
     * The name of the field or property in the input model that caused the error.
     * @type {string|null}
     * @nullable
     */
    field: string | null;
};

/**
 * Represents the error view model for creating or updating a blog post.
 */
export type CreateUpdateBlogErrorViewModel = {
    /**
     * A list of error messages encountered during blog post creation or update.
     * @type {TError[]|null}
     * @nullable
     */
    errorsMessages: TError[] | null;
};

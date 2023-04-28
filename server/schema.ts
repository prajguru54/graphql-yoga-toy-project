import { makeExecutableSchema } from "@graphql-tools/schema";
import { Comment, Link, Author } from "@prisma/client";
import { GraphQLContext } from "./context";

const typeDefinitions = /* GraphQL */ `
    type Query {
        info: String!
        links: [Link!]!
        comment(id: ID!): Comment
        comments: [Comment]
    }

    type Mutation {
        createLink(url: String!, description: String!, authorId: ID!): Link!
        postCommentOnLink(body: String!, linkId: ID!): Comment!
        createAuthor(name: String!): Author!
    }

    type Link {
        id: ID!
        description: String!
        url: String!
        comment: [Comment!]
        authorId: ID!
    }
    type Comment {
        id: ID!
        body: String!
        linkId: Int!
        authorId: Int!
    }

    type Author {
        id: ID!
        name: String!
        links: [Link!]
        comments: [Comment!]
    }
`;

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        links: (parent: unknown, args: {}, context: GraphQLContext) =>
            context.prisma.link.findMany(),
        comment: (
            parent: unknown,
            args: { id: string },
            context: GraphQLContext
        ) => {
            return context.prisma.comment.findUnique({
                where: { id: parseInt(args.id) },
            });
        },
        comments: (parent: unknown, args: {}, context: GraphQLContext) => {
            return context.prisma.comment.findMany();
        },
    },
    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
        authorId:(parent:Link) => parent.authorId,
    },
    Comment: {
        id: (parent: Comment) => parent.id,
        body: (parent: Comment) => parent.body,
        linkId: (parent: Comment) => parent.linkId,
        authorId:(parent:Comment) => parent.authorId,
    },
    Mutation: {
        async createLink(
            parent: unknown,
            args: { description: string; url: string; authorId: string },
            context: GraphQLContext
        ) {
            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                    authorId: parseInt(args.authorId),
                },
            });
            return newLink;
        },
        async postCommentOnLink(
            parent: unknown,
            args: { body: string; linkId: string; authorId: string },
            context: GraphQLContext
        ) {
            const createdComment = await context.prisma.comment.create({
                data: {
                    body: args.body,
                    linkId: parseInt(args.linkId),
                    authorId: parseInt(args.authorId),
                },
            });
            return createdComment;
        },
        async createAuthor(
            parent: unknown,
            args: { name: string },
            context: GraphQLContext
        ) {
            const authorName = args.name;
            console.log(`Author name: ${authorName}`);
            const createdAuthor = context.prisma.author.create({
                data: { name: authorName },
            });
            return createdAuthor;
        },
    },
};

export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions],
});

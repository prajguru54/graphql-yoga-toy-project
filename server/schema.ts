import { makeExecutableSchema } from "@graphql-tools/schema";
import { Author, Comment, Link } from "@prisma/client";
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
        comments: [Comment!]
        author: Author!
    }
    type Comment {
        id: ID!
        body: String!
        link: Link
        author: Author!
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
        author: (parent: Link, args: {}, context: GraphQLContext) =>
            context.prisma.author.findUnique({
                where: {
                    id: parent.authorId,
                },
            }),
        comments: (parent: Author, args: {}, context: GraphQLContext) => {
            context.prisma.comment.findMany({
                where: {
                    linkId: parent.id,
                },
            }); // Not working
        },
    },
    Comment: {
        id: (parent: Comment) => parent.id,
        body: (parent: Comment) => parent.body,
        author: (parent: Comment, args: {}, context: GraphQLContext) =>
            context.prisma.author.findUnique({
                where: {
                    id: parent.authorId,
                },
            }),
        link: (parent: Comment, args: {}, context: GraphQLContext) => {
            console.log(`linkedId: ${parent.linkId}`);
            // Adding this just to eliminate typing error, 
            // not sure why it's throwing the typing error
            if (!parent.linkId) {
                console.log(`linkedId: ${parent.linkId}`);
                return null;
            } 
            return context.prisma.link.findUnique({
                where: {
                    id: parent.linkId,
                },
            });
        },
    },
    Author: {
        id: (parent: Author) => parent.id,
        name: (parent: Author) => parent.name,
        links: (parent: Author, args: {}, context: GraphQLContext) => {
            return context.prisma.link.findMany({
                where: {
                    authorId: parent.id,
                },
            }); 
        },
        comments: (parent: Author, args: {}, context: GraphQLContext) => {
            return context.prisma.comment.findMany({
                where: {
                    authorId: parent.id,
                },
            }); 
        },
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

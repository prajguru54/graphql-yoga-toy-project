import { makeExecutableSchema } from "@graphql-tools/schema";
import type { Comment, Link } from "@prisma/client";
import { GraphQLContext } from "./context";

const typeDefinitions = /* GraphQL */ `
    type Query {
        info: String!
        feed: [Link!]!
        comment(id: ID!): Comment
        comments: [Comment]
    }

    type Mutation {
        postLink(url: String!, description: String!): Link!
        postCommentOnLink(body: String!, linkId: ID!): Comment!
    }

    type Link {
        id: ID!
        description: String!
        url: String!
        comment: [Comment]
    }
    type Comment {
        id: ID!
        body: String!
        linkId: Int!
    }
`;

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (parent: unknown, args: {}, context: GraphQLContext) =>
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
        comments: (parent:unknown, args:{}, context:GraphQLContext)=>{
            return context.prisma.comment.findMany()
        }
    },
    Link: {
        id: (parent: Link) => parent.id,
        description: (parent: Link) => parent.description,
        url: (parent: Link) => parent.url,
    },
    Comment: {
        id: (parent: Comment) => parent.id,
        body: (parent: Comment) => parent.body,
        linkId: (parent: Comment) => parent.linkId,
    },
    Mutation: {
        async postLink(
            parent: unknown,
            args: { description: string; url: string },
            context: GraphQLContext
        ) {
            const newLink = await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            });
            return newLink;
        },
        async postCommentOnLink(
            parent: unknown,
            args: { body: string; linkId: string },
            context: GraphQLContext
        ) {
            const createdComment = await context.prisma.comment.create({
                data: {
                    body: args.body,
                    linkId: parseInt(args.linkId),
                },
            });
            return createdComment;
        },
    },
};

export const schema = makeExecutableSchema({
    resolvers: [resolvers],
    typeDefs: [typeDefinitions],
});

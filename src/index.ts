import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

async function init(){
    const app = express();
    const PORT = Number(process.env.PORT) || 9000;

    app.use(express.json());

    //Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation{
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => `Hey there, I am graphql server`,
                say: (_, { name }: { name: string }) => `Hey ${name} Bro. How are you?`,
            },
            Mutation: {
                createUser: async(_, 
                    { firstName, lastName, email, password }: 
                    { firstName: string; lastName: string; email: string; password: string }
                    ) => {},
            },
        },
    })

    //Start the gql server
    await gqlServer.start();
    
    app.get('/', (req, res) => {
        return res.json({message: "Hello from threads backend app"});
    });

    app.use("/graphql", expressMiddleware(gqlServer));
    
    app.listen(PORT, () => console.log(`server started at port: ${PORT}`));
}

init();
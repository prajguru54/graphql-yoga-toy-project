import { createYoga } from "graphql-yoga";
import { createContext } from "./context";
import { schema } from "./schema";
const express = require("express");

const app = express();

const yoga = createYoga({ schema, context: createContext });
app.use("/graphql", yoga);
app.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
});

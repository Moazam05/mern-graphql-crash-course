const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
// Custom Imports
const Client = require("../models/clientModel");
const Project = require("../models/projectModel");

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        // return clients.find((client) => client.id === parent.clientId);
        return Client.findById(parent.clientId);
      },
    },
  }),
});

// Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // For Projects
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        // return projects;
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        // return projects.find((project) => project.id === id);
        return Project.findById(id);
      },
    },
    // For Clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        // return clients;
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        // return clients.find((client) => client.id === id);
        return Client.findById(id);
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Add a Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { name, email, phone }) {
        const client = new Client({
          name,
          email,
          phone,
        });
        return client.save();
      },
    },
    // Delete a Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { id }) {
        const existingClient = await Client.findById(id);
        if (!existingClient) {
          throw new Error("Client not found");
        }

        const deleteClient = await Client.findByIdAndDelete(id);
        return deleteClient;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

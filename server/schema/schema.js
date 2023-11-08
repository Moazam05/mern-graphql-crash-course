const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
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

        // Find and delete projects
        await Project.deleteMany({ clientId: id });

        const deleteClient = await Client.findByIdAndDelete(id);
        return deleteClient;
      },
    },
    // Add a Project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, { name, description, status, clientId }) {
        const project = new Project({
          name,
          description,
          status,
          clientId,
        });
        return project.save();
      },
    },
    // Delete a Project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { id }) {
        const existingProject = await Project.findById(id);
        if (!existingProject) {
          throw new Error("Project not found");
        }

        const deleteProject = await Project.findByIdAndDelete(id);
        return deleteProject;
      },
    },
    // Update a Project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, { id, name, description, status }) {
        return Project.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              description,
              status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

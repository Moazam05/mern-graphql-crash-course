import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_PROJECT } from "../graphql/queries/projectQueries";
import { UPDATE_PROJECT } from "../graphql/mutations/projectMutations";
import { useNavigate } from "react-router-dom";

const EditProjectForm = ({ project }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    status:
      project.status === "Completed"
        ? "completed"
        : project.status === "In Progress"
        ? "progress"
        : "Not Started",
    clientId: project.client.id,
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { id: project.id, ...formData },
    onCompleted: () => navigate("/"),
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const onSubmit = (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!formData.name || !formData.description || !formData.status) {
      return alert("All fields are required");
    }

    updateProject({
      name: formData.name,
      description: formData.description,
      status: formData.status,
      clientId: formData.clientId,
    });
  };

  return (
    <div className="mt-5">
      <h3>Update Project</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            id="status"
            className="form-select"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option value="new">Not Started</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProjectForm;

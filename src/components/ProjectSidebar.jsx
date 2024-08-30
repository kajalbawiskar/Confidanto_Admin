import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoTasklist } from "react-icons/go";
import { useStateContext } from "../contexts/ContextProvider";

const ProjectSidebar = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showProjectList, setShowProjectList] = useState(false);
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  if (activeMenu !== undefined && screenSize <= 900) {
    setActiveMenu(false);
  }
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("https://api.confidanto.com/projects");
        setProjects(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const toggleProjectList = () => {
    setShowProjectList((prevShow) => !prevShow);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/create-task/${projectId}`);
  };

  return (
    <div className="flex flex-col text-[#e6e5e3]">
      <div className="flex flex-col items-start p-2  py-0 ">
        <div className="relative">
          <button 
            className={` flex items-center ${activeMenu ? "justify-start" : "justify-center hover:bg-[#495057] p-4 rounded-full"}`}
            onClick={toggleProjectList}
          >
             <GoTasklist className={`${activeMenu ? "text-base" : "text-2xl ml-0"}`} />{activeMenu && <span className={`ml-2`}>{activeMenu ? "Task" : ""}</span>}
          </button>
          {/* Project List Dropdown */}
          {showProjectList && (
            <div className="absolute bottom-full mb-2 bg-gray-700 text-white rounded shadow-lg w-48 max-h-64 overflow-y-auto">
              <ul className="divide-y divide-gray-600">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li
                      key={project.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-600 transition duration-300"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {project.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400">No projects available</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;

import { useState } from "react";
const useActiveProjectState = () => {
  const [activeProject, setActiveProject] = useState("");
  return {
    activeProject, setActiveProject
  };
};

export default useActiveProjectState;
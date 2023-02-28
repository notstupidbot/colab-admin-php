import { useState } from "react";
const useActiveTabState = () => {
  const [activeTab, setActiveTab] = useState("");
  return {
    activeTab, setActiveTab
  };
};

export default useActiveTabState;
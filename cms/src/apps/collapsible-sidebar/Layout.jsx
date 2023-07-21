import {Default as TreeStories} from "../reusable-components/tw-tr-main/src/Tree.stories"
import TreeMenu from "../../cms/themes/preline/templates/draft/react/TreeMenu"
import classNames from "classnames";
import React, { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const Layout = ({children}) => {
  const [collapsed, setSidebarCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <div
      className={classNames({
        "container flex bg-zinc-100 min-h-screen": true,
        // "grid-cols-sidebar": !collapsed,
        // "grid-cols-sidebar-collapsed": collapsed,
        "transition-[grid-template-columns] duration-300 ease-in-out": true,
      })}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setSidebarCollapsed}
        shown={showSidebar}
      />
      <div className="w-full">
        <Navbar onMenuButtonClick={() => setShowSidebar((prev) => !prev)} />
        {children}
        <div className="w-[300px] overflow-auto">
          <div className="max-w-[400px]">
              <TreeStories/>
          </div>
        </div>
      </div>
    </div>
  );
};

export  {Layout};
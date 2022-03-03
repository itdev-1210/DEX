import React, { useState } from 'react'


const SidebarContext = React.createContext({ selectedSidebar: true, setSelectedSidebar: () => null })

const SidebarContextProvider = ({ children }) => {
  const [selectedSidebar, updateSelectedSidebar] = useState(true)

  const setSelectedSidebar = () => {
    console.log("UPDATE SIDEBAR")
    updateSelectedSidebar(!selectedSidebar)
  }

  return (
    <SidebarContext.Provider value={{ selectedSidebar, setSelectedSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export { SidebarContext, SidebarContextProvider }


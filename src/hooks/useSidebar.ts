import { useContext } from 'react'
import { SidebarContext } from 'contexts/Sidebar/sidebarContext'

const useSidebar = () => {
  const { selectedSidebar } = useContext(SidebarContext)
  return { selectedSidebar }
}

export default useSidebar

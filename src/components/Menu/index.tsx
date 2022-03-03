import React, { useContext } from 'react'
import { Menu as UikitMenu } from '@dinoswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import { SidebarContext } from 'contexts/Sidebar/sidebarContext'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd, } from 'state/hooks'
import { config, sideconfig } from './config'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { setSelectedSidebar } = useContext(SidebarContext)

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      setSidebar={setSelectedSidebar}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config}
      sidelinks={sideconfig}
      {...props}
    />
  )
}

export default Menu

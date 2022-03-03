import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { light, dark } from '@dinoswap/uikit'

const CACHE_KEY = 'IS_DARK'

const ThemeContext = React.createContext({ isDark: null, toggleTheme: () => null })

const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {


    

    const isDarkUserSetting = localStorage.getItem(CACHE_KEY) || "null"
    // return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
    console.log("DARK", isDarkUserSetting, window.location.search)

    const isDarkUser = (window.location.search.indexOf("t=d") > -1 || window.location.search.indexOf("t=l") > -1) ? (window.location.search.indexOf("t=d") > -1) : (JSON.parse(isDarkUserSetting) || false)

     
     return isDarkUser
  })

  const toggleTheme = () => {
    if (window.location.search.indexOf("t=d") > -1 || window.location.search.indexOf("t=l") > -1){
      window.location.search = (window.location.search.indexOf("?t=d") > -1) ? "?t=l" : "?t=d";
    }
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      return !prevState
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={isDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }

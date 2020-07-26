import React from "react"
import rootStore from "./RootStore"
import { AppearanceProvider } from "react-native-appearance"
import { Provider as MobxProvider } from "mobx-react"

//const StoresContiner = ({ childrens }) => {
const StoresContiner = ({ childrens }: any) => {
  console.log("StoresContiner")
  console.log("childrens = " + childrens)
  console.log("rootStore = " + rootStore)

  return (
    <AppearanceProvider>
      <MobxProvider {...rootStore}>{childrens}</MobxProvider>
    </AppearanceProvider>
  )
}

export default StoresContiner

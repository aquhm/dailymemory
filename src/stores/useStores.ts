import React, { FC, createContext, ReactNode } from "react";
import RootStore from "./RootStore";
import AuthStore from "./AuthStore";
import { MobXProviderContext } from "mobx-react";

export type RootStoreType = {
  authStore: AuthStore;
};

export type StoreKeys = keyof RootStore;
export const StoreContext = createContext<RootStore>({} as RootStore);
export const StoreProvider = StoreContext.Provider;
export const useStores = () => React.useContext(MobXProviderContext);

/**
 * React hooks를 사용하는 컴포넌트에서 store를 가져올 때 사용한다.
 * 참조) https://mobx-react.js.org/recipes-migration#hooks-for-the-rescue
 **/
export const useGlobalStore = () => React.useContext(StoreContext);

export type StoreComponent = FC<{
  store: RootStore;
  children: ReactNode;
}>;

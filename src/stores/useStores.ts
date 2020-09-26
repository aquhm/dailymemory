import React, { FC, createContext, useContext, ReactNode, ReactElement, Context } from "react";
import { useLocalStore } from "mobx-react-lite";
import RootStore from "./RootStore";
import AuthStore from "./AuthStore";
import { MobXProviderContext } from "mobx-react";

export type RootStoreType = {
  authStore: AuthStore;
};

export type StoreKeys = keyof RootStore;
export const StoreContext = createContext<RootStore>({} as RootStore);
export const StoreProvider = StoreContext.Provider;

/*
export const useStores = (): RootStore => {
  const store = useContext(StoreContext);

  console.log("------------------------------------- useStores store : " + store);
  if (!store) throw new TypeError("useStore must be used inside a StoreProvider");

  return store;
};
*/
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

/*
export const StoreProvider = ({ children }) => {
  const store = useLocalStore(() => {
    return RootStore.Instance;
  });

  return <StoreContext.Provider value={store}> {children} </StoreContext.Provider>;
};
*/

import AuthStore from "./AuthStore"

class RootStore {
  constructor() {
    this._authStore = new AuthStore(this)

    console.log("Initialize RootStore")
  }

  intialize = () => {
    this._authStore = new AuthStore(this)
  }
}

const rootStore = new RootStore()

export default rootStore

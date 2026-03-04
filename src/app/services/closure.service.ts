import { ClosureDataInterface } from "../../features/closure/domain/closure.state"
import Api from "../axios"

const api = new Api()

export async function getCurrentClosureReq(): Promise<ClosureDataInterface> {
  try {
    const currentClosure = await api.get({
      path: "closure/resume-current-closure",
    })
    const { error } = currentClosure
    if (error === null) {
      return currentClosure.result as ClosureDataInterface
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON getCurrentClosureReq")
    console.error({ error })
    throw error
  }
}

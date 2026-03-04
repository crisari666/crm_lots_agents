import { UsersListState } from "./users-state";

export default function filterUsersByOffice(state: UsersListState) {
  if(state.officeIdFilter === ""){
    state.users = state.usersOriginal.slice()
  }else {
    state.users = state.usersOriginal.slice().filter((el) => el.office !== null ? (el.office! as any)._id! === state.officeIdFilter : false).sort((a, b) => {
      if(a.level! > b.level!) return 1
      if(a.level! < b.level!) return -1
      return 0
    })
  }
}
  
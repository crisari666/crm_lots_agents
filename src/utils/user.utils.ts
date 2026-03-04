export const getUserLevelDesc = (level: number) => {
  switch(level){
    case 0:
      return "Admin"
    case 1:
      return "Sub"
    case 2:
      return "Lider Principal"
    case 3:
      return "Lider"
    case 4:
      return "User"
    case 5:
      return "Debt Collector"
    case 6:
      return "Oficina"
    case 7:
      return "Oficina"
    case 8:
      return "Oficina"
    case 9:
      return "Asignador"
    default:
      return "Unknown"
  }
}
export class OmegaSoftConstants {
  static localstorageAuthKey = "omega_web_auth"
  static localstorageTokenKey = "omega_web_token"
  static googleApiKey = "AIzaSyB42KE_SyTx0mvEWe1Z4EU9ramLWn4JBF4"

  static alcatronId = '669ec1d134a4a5e23f8c4536'
  static arsanId = '66292558df71af265863916e'

  static collectorIdDefault = '662acedb5f9f6dc51b6b095b'


  static superUsersId = ['kdev999','arsan','alcatron']

  static collectorLocationEnum = [{_id: 'us', name: 'US'}, {_id: 'co', name: 'CO'}]

  static periodGraph = [
    {_id: 'day', name: 'Dia'}, 
    {_id: 'week', name: 'Semana'}, 
    {_id: 'month', name: 'Mes'}, 
  ]

  static typeSettingsOptions = [
    {_id: 'boolean', 'name': 'Boolean'},
    {_id: 'number', 'name': 'Number'},
    {_id: 'string', 'name': 'String'},
    {_id: 'object', 'name': 'json'},
  ]

  static officeRanked = [
    {_id: 'elite', name: 'elite'},
    {_id: 'medium', name: 'medium'},
    {_id: 'bad', name: 'bad'},
  ]

  static expenseType = [
    {_id: 0, name: 'Entrevistas'},
    {_id: 1, name: 'Numeros'},
    {_id: 2, name: 'Arriendo'},
    {_id: 3, name: 'Nomina'},
    {_id: 4, name: 'Publicidad'},
    {_id: 5, name: 'Viaticos'},
    {_id: 6, name: 'Amoblados'},
    {_id: 7, name: 'Aseo'},
    {_id: 8, name: 'Servicios'},
    {_id: 9, name: 'Otros'},
  ]

}

// auth info 
export interface auth {
  id: string
  username: string
  fullname: string
  accessToken: string
  refreshToken: string
}
// login paramater receive login form 
export interface loginReq {
  email: string
  password: string
}
// define type safe when user logout web
export interface logoutReq {
  userId: string
}
// define type safe when access token expried
export interface refreshReq {
  userId: string
}
// register paramater receive when user submit register form 
export interface registerReq {
  email: string
  username: string
  password: string
  fullname: string
}

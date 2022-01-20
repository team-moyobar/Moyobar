import { Link } from "react-router-dom"

export default function Nav() {
  return (
    <>
      <hr />
      <button><Link to="/">홈</Link></button>
      <button><Link to="/signup">회원가입</Link></button>    
      <button><Link to="/login">로그인</Link></button>
      <hr />
    </>
  )
}
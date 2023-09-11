import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import NavDropdown from "./NavDropdown";
import SearchButton from "./SearchButton";
import WriteButton from "./WriteButton";
import LoginRegisterButtons from "./LoginRegisterButtons";
import Nav from "./Nav";

export default function DefaultNav() {
    const { user } = useContext(UserContext);
    const [isDesktop, setIsDesktop] = useState(document.body.clientWidth > 700)
    
    useEffect(() => {
      function handleResize() {
        setIsDesktop(document.body.clientWidth > 700)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <Nav>
        <SearchButton />
 
        {user && isDesktop && (
          <WriteButton />
        )}
        {user ? (
          <NavDropdown />
        ) : (
          <LoginRegisterButtons />
        )}
        </Nav>
    )
}
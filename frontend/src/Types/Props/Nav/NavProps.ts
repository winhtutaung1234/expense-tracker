import { User } from "../../User"

type NavProps = {
    user: User | null | undefined;
    showNav: boolean;
    fixedNav: boolean;
}

export default NavProps;
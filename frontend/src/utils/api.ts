import { DbUser } from "../utils/interfaces";


export default async function fetchDbUser(currentUser: string)
{
    //change the base url to the deployed url
    const getDbUserUrl = new URL(
        `/api/user/${currentUser}`,
        process.env.NEXT_FRONTEND_BASE_URL
    );
    console.log("Fetching data from " + getDbUserUrl.toString());
    const dbUser: DbUser = await fetch(getDbUserUrl.toString())
        .then((res) => res.json())
        .then((data) => data);

    if(dbUser.message === 'User not found'){
        return null
    }

    return dbUser
}
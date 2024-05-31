import { DbUser } from "../utils/interfaces";


export default async function fetchDbUser(currentUser: string)
{
    //change the base url to the deployed url
    const getDbUserUrl = new URL(
        `/api/user/${currentUser}`,
        'http://localhost:3000'
    );
    console.log("Fetching data from " + getDbUserUrl.toString());
    const dbUser: DbUser = await fetch(getDbUserUrl.toString())
        .then((res) => res.json())
        .then((data) => data);

    if(dbUser.message === 'User not found'){
        console.log("USER NOT FOUND IN DATABASE SOMETHING IS WRONG WITH MY USER")
        return null
    }

    return dbUser
}
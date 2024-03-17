import { User } from "../models/user";
import { userModelToLocalhost } from "../mappers/user-to-localhost.mapper";
import { localhostUserToModel } from "../mappers/localhost-user.mapper";

/**
 * @param {Like<User>} userLike
 * @returns {Promise<User>}
 */
export const saveUser = async (userLike) => {
    const user = new User(userLike);

    if (!user.firstName || !user.lastName) 
        throw 'First name and last name are required';

    const userToSave = userModelToLocalhost(user);
    let userUpdated;

    if (user.id) {
        userUpdated = await updateUser(userToSave);
    } else {
        userUpdated = await createUser(userToSave);
    }

    return localhostUserToModel(userUpdated);
}

/**
 * @param {Like<User>} user
 * @returns {Promise<User>}
 */
const createUser = async (user) => {
    const url = `${import.meta.env.VITE_URL_API}/users`;
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const newUser = await res.json();

    return newUser;
}

/**
 * @param {Like<User>} user
 * @returns {Promise<User>}
 */
const updateUser = async (user) => {
    const url = `${import.meta.env.VITE_URL_API}/users/${user.id}`;
    const res = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const updatedUser = await res.json();

    return updatedUser;
}

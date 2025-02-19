import { httpClient } from "./https"

export const loadBookmark = async() => {
  const response = await httpClient.get(
    `${import.meta.env.VITE_SERVER_ADDRESS}/maps/destinations`
  );
  console.log(response.data);
  return response.data;
}

export const deleteBookmark = async(placeId: string) => {
    const response = await httpClient.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/maps/destinations/${placeId}`)
    console.log(response.data)
    return(response.data);
}

export const loadMaps = async() => {
    const response = await httpClient.get(
        `${import.meta.env.VITE_SERVER_ADDRESS}/maps/destinations`
    );
    return(response.data)

}
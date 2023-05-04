export async function fetchMaterial(endpoint:string){
  try{
    return await (
      await fetch("http://localhost:3000/api/" + endpoint, {
        method: "GET",
      })
    ).json();
  }
  catch (e) {
    console.log(e)
    return undefined
  }
}
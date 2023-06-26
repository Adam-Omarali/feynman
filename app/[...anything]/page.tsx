export default async function DisplayContent() {
  let result = await (
    await fetch("/api/getQuestion", { method: "GET" })
  ).json();
  return <div>{result.length}</div>;
}

export default async function Home({ params }: { params: string }) {
  const course = await (
    await fetch("http://localhost:3000/api/getCourse", {
      method: "POST",
      body: JSON.stringify(params),
    })
  ).json();

  return <div>{course.name}</div>;
}

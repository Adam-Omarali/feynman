const imageList = [
  "https://www.notion.so/images/page-cover/nasa_space_shuttle_columbia.jpg",
  "https://www.notion.so/images/page-cover/nasa_eagle_in_lunar_orbit.jpg",
  "https://www.notion.so/images/page-cover/nasa_wrights_first_flight.jpg",
  "https://www.notion.so/images/page-cover/nasa_orion_nebula.jpg",
  "https://www.notion.so/images/page-cover/nasa_space_shuttle_columbia_and_sunrise.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_1.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_11.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_sekka_1.jpg",
  "https://www.notion.so/images/page-cover/gradients_5.png",
  "https://www.notion.so/images/page-cover/gradients_11.jpg",
  "https://www.notion.so/images/page-cover/gradients_8.png",
  "https://www.notion.so/images/page-cover/gradients_10.jpg",
];

export function MaterialCard() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src={imageList[Math.floor(Math.random() * imageList.length)]}
          alt="Image"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

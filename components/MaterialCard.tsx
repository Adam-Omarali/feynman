import { Plus } from "lucide-react";

const imageList = [
  "https://www.notion.so/images/page-cover/nasa_space_shuttle_columbia.jpg",
  "https://www.notion.so/images/page-cover/nasa_eagle_in_lunar_orbit.jpg",
  "https://www.notion.so/images/page-cover/nasa_wrights_first_flight.jpg",
  "https://www.notion.so/images/page-cover/nasa_space_shuttle_columbia_and_sunrise.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_1.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_11.jpg",
  "https://www.notion.so/images/page-cover/woodcuts_sekka_1.jpg",
  "https://www.notion.so/images/page-cover/gradients_5.png",
  "https://www.notion.so/images/page-cover/gradients_11.jpg",
  "https://www.notion.so/images/page-cover/gradients_8.png",
  "https://www.notion.so/images/page-cover/gradients_10.jpg",
];

export function MaterialCard({ title, add }: { title?: string; add?: string }) {
  return (
    <div className="card w-56 h-56 bg-base-100 shadow-xl">
      {title ? (
        <>
          <figure>
            <img
              src={imageList[Math.floor(title.length % imageList.length)]}
              alt="Image"
              className="w-full h-56 object-cover"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="card-title font-normal">{title}</h2>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-56">
          <div className="flex flex-col items-center content-center">
            <Plus size={40} />
            <h2 className="card-title font-normal text-slate-500 hover:text-black">
              {add}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

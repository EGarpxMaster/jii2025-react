import Carousel from "../components/carousel/carousel";
import EventInfo from "../components/event-info/event-info";

export default function Home() {
  return (
    <div className="w-full">
      
      <main className="w-full mt-[100px] md:mt-[90px]">
        <Carousel />
          <EventInfo />
      </main>
    </div>
  )
}